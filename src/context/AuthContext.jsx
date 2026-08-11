import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, logSystemAction } from '../lib/supabase';

const AuthContext = createContext(null);

// Initial Demo/Fallback profiles when Supabase is not yet connected
const LOCAL_STORAGE_KEY_USER = 'edtech_current_user';
const LOCAL_STORAGE_KEY_PROFILES = 'edtech_profiles';

const DEFAULT_DEMO_USERS = [
  {
    id: 'demo-admin-01',
    email: 'admin@edtech.edu.vn',
    full_name: 'Quản tri viên Trưởng',
    role: 'admin',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin1'
  },
  {
    id: 'demo-teacher-01',
    email: 'giaovien.nguyen@edtech.edu.vn',
    full_name: 'Cô Nguyễn Thị Mai',
    role: 'teacher',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherMai'
  },
  {
    id: 'demo-student-01',
    email: 'hocsinh.an@edtech.edu.vn',
    full_name: 'Trần Văn An',
    role: 'student',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnStudent'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize storage
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        // Real Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        });

        setLoading(false);
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } else {
        // Fallback / Local Storage Mode for Instant Preview & Development
        let storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
        if (!storedUsers) {
          localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(DEFAULT_DEMO_USERS));
        }

        const savedUserStr = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
        if (savedUserStr) {
          try {
            const savedProfile = JSON.parse(savedUserStr);
            setUser({ id: savedProfile.id, email: savedProfile.email });
            setProfile(savedProfile);
          } catch (e) {
            localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
          }
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data) {
          setProfile(data);
        } else if (error) {
          console.error('Error fetching profile:', error);
        }
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  };

  // Sign In with Email & Password
  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          throw new Error('Tài khoản Email chưa được kích hoạt trong Supabase. Bạn hãy vào Supabase Dashboard -> Authentication -> Providers -> Email -> Tắt "Confirm email", hoặc chọn "Confirm email" trong tab Users!');
        }
        throw error;
      }
      if (data?.user) {
        await fetchProfile(data.user.id);
        await logSystemAction(data.user.id, 'LOGIN', { email });
      }
      return data;
    } else {
      // Local Auth Match
      const profilesStr = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES) || '[]';
      const profilesList = JSON.parse(profilesStr);
      const found = profilesList.find((p) => p.email.toLowerCase() === email.toLowerCase());

      if (!found) {
        throw new Error('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      }

      setUser({ id: found.id, email: found.email });
      setProfile(found);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(found));
      return { user: found, profile: found };
    }
  };

  // Sign Up with Email, Password, Full Name, Role
  const signUp = async ({ email, password, fullName, role = 'student' }) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;
      if (data?.user) {
        // Trigger automatically handles table insertion in Supabase
        await logSystemAction(data.user.id, 'REGISTER', { email, role, fullName });
      }
      return data;
    } else {
      // Local Auth Registration
      const profilesStr = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES) || '[]';
      const profilesList = JSON.parse(profilesStr);

      if (profilesList.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email này đã được đăng ký trên hệ thống!');
      }

      const newProfile = {
        id: 'usr_' + Date.now(),
        email,
        full_name: fullName,
        role: role,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName}`
      };

      const updatedList = [...profilesList, newProfile];
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(updatedList));

      setUser({ id: newProfile.id, email: newProfile.email });
      setProfile(newProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newProfile));

      return { user: newProfile, profile: newProfile };
    }
  };

  // Switch Role / Quick Demo Login Helper
  const switchDemoUser = (role) => {
    const profilesStr = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES) || '[]';
    const profilesList = JSON.parse(profilesStr);
    const target = profilesList.find((p) => p.role === role) || DEFAULT_DEMO_USERS.find(p => p.role === role);

    if (target) {
      setUser({ id: target.id, email: target.email });
      setProfile(target);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(target));
    }
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    switchDemoUser,
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher' || profile?.role === 'admin',
    isStudent: profile?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
