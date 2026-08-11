-- ====================================================================
-- SUPABASE FULL SCHEMA FOR EDTECH PRE-PRIMARY PLATFORM (5-6 TUỔI)
-- Chạy toàn bộ file SQL này trong Supabase SQL Editor
-- ====================================================================

-- 1. KÍCH HOẠT EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BẢNG THÔNG TIN NGƯỜI DÙNG (PROFILES - TÍCH HỢP AUTH)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG LỚP HỌC (CLASSES)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'Tổng hợp',
    grade_level TEXT NOT NULL DEFAULT 'Mẫu giáo 5-6 tuổi', -- Mẫu giáo 5-6 tuổi, Tiền tiểu học
    join_code TEXT UNIQUE NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG HỌC SINH TRONG LỚP (CLASS MEMBERS)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(class_id, student_id)
);

-- 5. BẢNG KHO HỌC LIỆU (MATERIALS)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'pdf', 'docx', 'pptx', 'mp4', 'image', 'audio', 'other'
    file_size BIGINT DEFAULT 0,
    subject TEXT NOT NULL, -- 'Toán học', 'Tiếng Việt', 'Kỹ năng & Tư duy'
    grade_level TEXT NOT NULL DEFAULT '5-6 tuổi',
    tags TEXT[] DEFAULT '{}',
    privacy_level TEXT NOT NULL CHECK (privacy_level IN ('private', 'class', 'public')) DEFAULT 'public',
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG GÁN HỌC LIỆU CHO LỚP (MATERIAL ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS public.material_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(material_id, class_id)
);

-- 7. BẢNG BÀI TẬP DÀNH CHO 5-6 TUỔI (EXERCISES: TOÁN & TIẾNG VIỆT)
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('toan', 'tieng_viet', 'tu_duy')),
    exercise_type TEXT NOT NULL CHECK (
        exercise_type IN (
            'math_split_merge',  -- Tách gộp số
            'math_fill_number',  -- Điền số còn thiếu
            'math_find_number',  -- Tìm số & Đếm số
            'math_pattern',      -- Tìm quy luật
            'vietnamese_phonics',-- Luyện phát âm chữ cái
            'vietnamese_spelling',-- Đánh vần ghép âm
            'vietnamese_reading' -- Luyện đọc từ & câu ngắn
        )
    ),
    config JSONB NOT NULL DEFAULT '{}'::jsonb, -- Lưu nội dung các câu hỏi, hình ảnh, đáp án
    grade_level TEXT NOT NULL DEFAULT '5-6 tuổi',
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG GÁN BÀI TẬP CHO LỚP (EXERCISE ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS public.exercise_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(exercise_id, class_id)
);

-- 9. BẢNG KẾT QUẢ BÀI TẬP HỌC SINH (EXERCISE SUBMISSIONS)
CREATE TABLE IF NOT EXISTS public.exercise_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL DEFAULT 0,
    max_score INT NOT NULL DEFAULT 100,
    stars INT NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
    answers JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. BẢNG TRÒ CHƠI TƯ DUY & CỦNG CỐ (GAMES)
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    game_type TEXT NOT NULL CHECK (game_type IN ('matching', 'math_speed', 'logic_mind')),
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    subject TEXT NOT NULL DEFAULT 'Toán & Tư duy',
    grade_level TEXT NOT NULL DEFAULT '5-6 tuổi',
    privacy_level TEXT NOT NULL CHECK (privacy_level IN ('private', 'class', 'public')) DEFAULT 'public',
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. BẢNG GÁN TRÒ CHƠI CHO LỚP (GAME ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS public.game_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(game_id, class_id)
);

-- 12. BẢNG KẾT QUẢ KHI CHƠI GAME (GAME RESULTS)
CREATE TABLE IF NOT EXISTS public.game_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL DEFAULT 0,
    max_score INT NOT NULL DEFAULT 100,
    stars INT NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
    completion_time_seconds INT NOT NULL DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. BẢNG NHẬT KÝ HỆ THỐNG (SYSTEM LOGS - DÀNH CHO ADMIN)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
CREATE POLICY "Admins can do everything on profiles"
    ON public.profiles FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- CLASSES POLICIES
DROP POLICY IF EXISTS "Authenticated users can read classes" ON public.classes;
CREATE POLICY "Authenticated users can read classes"
    ON public.classes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers and Admins can create classes" ON public.classes;
CREATE POLICY "Teachers and Admins can create classes"
    ON public.classes FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

DROP POLICY IF EXISTS "Teachers can update their own classes or Admin" ON public.classes;
CREATE POLICY "Teachers can update their own classes or Admin"
    ON public.classes FOR UPDATE TO authenticated
    USING (
        teacher_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Teachers can delete their own classes or Admin" ON public.classes;
CREATE POLICY "Teachers can delete their own classes or Admin"
    ON public.classes FOR DELETE TO authenticated
    USING (
        teacher_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- CLASS MEMBERS POLICIES
DROP POLICY IF EXISTS "Read class members" ON public.class_members;
CREATE POLICY "Read class members"
    ON public.class_members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students join class or Teacher/Admin add student" ON public.class_members;
CREATE POLICY "Students join class or Teacher/Admin add student"
    ON public.class_members FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Delete class member" ON public.class_members;
CREATE POLICY "Delete class member"
    ON public.class_members FOR DELETE TO authenticated USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = class_id AND c.teacher_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- MATERIALS POLICIES
DROP POLICY IF EXISTS "Read materials" ON public.materials;
CREATE POLICY "Read materials"
    ON public.materials FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers and Admins insert materials" ON public.materials;
CREATE POLICY "Teachers and Admins insert materials"
    ON public.materials FOR INSERT TO authenticated
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

DROP POLICY IF EXISTS "Teachers update own material or Admin" ON public.materials;
CREATE POLICY "Teachers update own material or Admin"
    ON public.materials FOR UPDATE TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Teachers delete own material or Admin" ON public.materials;
CREATE POLICY "Teachers delete own material or Admin"
    ON public.materials FOR DELETE TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- MATERIAL ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Read material assignments" ON public.material_assignments;
CREATE POLICY "Read material assignments"
    ON public.material_assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers and Admins assign materials" ON public.material_assignments;
CREATE POLICY "Teachers and Admins assign materials"
    ON public.material_assignments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Teachers and Admins delete material assignments" ON public.material_assignments;
CREATE POLICY "Teachers and Admins delete material assignments"
    ON public.material_assignments FOR DELETE TO authenticated USING (true);

-- EXERCISES POLICIES
DROP POLICY IF EXISTS "Read exercises" ON public.exercises;
CREATE POLICY "Read exercises"
    ON public.exercises FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers and Admins insert exercises" ON public.exercises;
CREATE POLICY "Teachers and Admins insert exercises"
    ON public.exercises FOR INSERT TO authenticated
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

DROP POLICY IF EXISTS "Teachers update own exercise or Admin" ON public.exercises;
CREATE POLICY "Teachers update own exercise or Admin"
    ON public.exercises FOR UPDATE TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Teachers delete own exercise or Admin" ON public.exercises;
CREATE POLICY "Teachers delete own exercise or Admin"
    ON public.exercises FOR DELETE TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- EXERCISE ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Read exercise assignments" ON public.exercise_assignments;
CREATE POLICY "Read exercise assignments"
    ON public.exercise_assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers assign exercises" ON public.exercise_assignments;
CREATE POLICY "Teachers assign exercises"
    ON public.exercise_assignments FOR INSERT TO authenticated WITH CHECK (true);

-- EXERCISE SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Read exercise submissions" ON public.exercise_submissions;
CREATE POLICY "Read exercise submissions"
    ON public.exercise_submissions FOR SELECT TO authenticated USING (
        student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

DROP POLICY IF EXISTS "Students submit exercises" ON public.exercise_submissions;
CREATE POLICY "Students submit exercises"
    ON public.exercise_submissions FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid());

-- GAMES POLICIES
DROP POLICY IF EXISTS "Read games" ON public.games;
CREATE POLICY "Read games"
    ON public.games FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers and Admins insert games" ON public.games;
CREATE POLICY "Teachers and Admins insert games"
    ON public.games FOR INSERT TO authenticated
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

DROP POLICY IF EXISTS "Teachers update own game or Admin" ON public.games;
CREATE POLICY "Teachers update own game or Admin"
    ON public.games FOR UPDATE TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Teachers delete own game or Admin" ON public.games;
CREATE POLICY "Teachers delete own game or Admin"
    ON public.games FOR DELETE TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- GAME ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Read game assignments" ON public.game_assignments;
CREATE POLICY "Read game assignments"
    ON public.game_assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers and Admins assign games" ON public.game_assignments;
CREATE POLICY "Teachers and Admins assign games"
    ON public.game_assignments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Teachers and Admins remove game assignment" ON public.game_assignments;
CREATE POLICY "Teachers and Admins remove game assignment"
    ON public.game_assignments FOR DELETE TO authenticated USING (true);

-- GAME RESULTS POLICIES
DROP POLICY IF EXISTS "Read game results" ON public.game_results;
CREATE POLICY "Read game results"
    ON public.game_results FOR SELECT TO authenticated USING (
        student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    );

DROP POLICY IF EXISTS "Students insert own game results" ON public.game_results;
CREATE POLICY "Students insert own game results"
    ON public.game_results FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid());

-- SYSTEM LOGS POLICIES
DROP POLICY IF EXISTS "Admins read system logs" ON public.system_logs;
CREATE POLICY "Admins read system logs"
    ON public.system_logs FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Authenticated users insert system logs" ON public.system_logs;
CREATE POLICY "Authenticated users insert system logs"
    ON public.system_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ====================================================================
-- INSTRUCTIONS FOR STORAGE BUCKET SETUP IN SUPABASE DASHBOARD:
-- 1. Vào Storage -> Create New Bucket: name = "materials"
-- 2. Đặt Public = ON (cho phép xem file học liệu public)
-- ====================================================================
