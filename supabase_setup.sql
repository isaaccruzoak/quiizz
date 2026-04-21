-- ============================================================
-- ESCOLHA DIFÍCIL — Setup do banco no Supabase
-- Cole este SQL no editor SQL do Supabase e execute
-- ============================================================

-- 1. Tabela de perguntas
CREATE TABLE IF NOT EXISTS questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text        text NOT NULL,
  option_a    text NOT NULL,
  option_b    text NOT NULL,
  category    text NOT NULL DEFAULT 'geral',
  is_active   boolean NOT NULL DEFAULT true,
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabela de votos
CREATE TABLE IF NOT EXISTS votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice      text NOT NULL CHECK (choice IN ('A', 'B')),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id, user_id)
);

-- 3. Índices de performance
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_votes_question_id  ON votes(question_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id      ON votes(user_id);

-- 4. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. Row Level Security (RLS)
-- ============================================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes     ENABLE ROW LEVEL SECURITY;

-- Questions: qualquer um lê, autenticados criam, dono atualiza
CREATE POLICY "questions_select_public"
  ON questions FOR SELECT USING (is_active = true);

CREATE POLICY "questions_insert_auth"
  ON questions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "questions_update_owner"
  ON questions FOR UPDATE
  USING (created_by = auth.uid());

-- Votes: qualquer um lê contagem, autenticados votam uma vez
CREATE POLICY "votes_select_public"
  ON votes FOR SELECT USING (true);

CREATE POLICY "votes_insert_auth"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================
-- 6. Perguntas iniciais (seed)
-- ============================================================
INSERT INTO questions (text, option_a, option_b, category) VALUES
  ('Você prefere ganhar R$1 milhão agora ou trabalhar 10 anos e acumular R$10 milhões?',
   'R$1 milhão agora', 'R$10 milhões em 10 anos', 'dinheiro'),
  ('Você prefere ter superpoderes mas não poder contar para ninguém, ou ser famoso mundialmente sem superpoderes?',
   'Ter superpoderes em segredo', 'Ser famoso mundialmente', 'fantasias'),
  ('Você prefere viver 100 anos com saúde mediana ou 60 anos com saúde perfeita?',
   '100 anos com saúde mediana', '60 anos com saúde perfeita', 'vida'),
  ('Você prefere poder voar ou ser invisível?',
   'Poder voar', 'Ser invisível', 'fantasias'),
  ('Você prefere morar em uma grande cidade agitada ou no campo em total paz?',
   'Grande cidade agitada', 'Campo em total paz', 'estilo de vida'),
  ('Você prefere saber como vai morrer ou quando vai morrer?',
   'Como vai morrer', 'Quando vai morrer', 'existencial'),
  ('Você prefere ter a habilidade de falar todos os idiomas do mundo ou tocar qualquer instrumento musical perfeitamente?',
   'Falar todos os idiomas', 'Tocar qualquer instrumento', 'habilidades'),
  ('Você prefere nunca mais precisar dormir ou nunca mais sentir fome?',
   'Nunca mais dormir', 'Nunca mais sentir fome', 'fantasias'),
  ('Você prefere viajar para o passado ou para o futuro?',
   'Viajar para o passado', 'Viajar para o futuro', 'fantasia'),
  ('Você prefere ter muito dinheiro mas trabalhar 80h por semana, ou ganhar pouco mas ter todo o tempo livre?',
   'Muito dinheiro, 80h/semana', 'Pouco dinheiro, tempo livre', 'trabalho'),
  ('Você prefere ser o mais inteligente do mundo ou o mais feliz?',
   'Ser o mais inteligente', 'Ser o mais feliz', 'existencial'),
  ('Você prefere viver sem internet ou sem televisão?',
   'Viver sem internet', 'Viver sem televisão', 'tecnologia'),
  ('Você prefere comer sua comida favorita todo dia pelo resto da vida ou nunca comer ela novamente?',
   'Comer todo dia para sempre', 'Nunca comer novamente', 'dilemas'),
  ('Você prefere ter a memória de um elefante ou a velocidade de um guepardo?',
   'Memória de elefante', 'Velocidade de guepardo', 'habilidades'),
  ('Você prefere ser famoso e pobre ou rico e anônimo?',
   'Famoso e pobre', 'Rico e anônimo', 'vida')
ON CONFLICT DO NOTHING;
