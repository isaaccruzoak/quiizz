import { supabase } from "./supabase";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

function calcStats(votes: { choice: string }[], userVote?: string | null) {
  const votesA = votes.filter((v) => v.choice === "A").length;
  const votesB = votes.filter((v) => v.choice === "B").length;
  const total = votesA + votesB;
  return {
    votesA,
    votesB,
    totalVotes: total,
    percentA: total === 0 ? 50 : Math.round((votesA / total) * 100),
    percentB: total === 0 ? 50 : Math.round((votesB / total) * 100),
    userVote: userVote ?? null,
  };
}

function formatQuestion(q: Record<string, unknown>, votes: { choice: string; user_id: string | null }[], userId?: string | null) {
  const userVote = userId ? votes.find((v) => v.user_id === userId)?.choice ?? null : null;
  return {
    id: q.id as string,
    text: q.text as string,
    optionA: q.option_a as string,
    optionB: q.option_b as string,
    category: q.category as string,
    createdAt: q.created_at as string,
    createdBy: (q.created_by as string) ?? null,
    ...calcStats(votes, userVote),
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: async (data: { email: string; username: string; password: string }) => {
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username } },
    });
    if (error) throw new Error(error.message);
    return {
      data: {
        data: {
          user: {
            id: result.user!.id,
            email: result.user!.email!,
            username: data.username,
            createdAt: result.user!.created_at,
          },
          token: result.session?.access_token ?? "",
        },
      },
    };
  },

  login: async (data: { identifier: string; password: string }) => {
    const { data: result, error } = await supabase.auth.signInWithPassword({
      email: data.identifier,
      password: data.password,
    });
    if (error) throw new Error("Credenciais inválidas.");
    const username = result.user.user_metadata?.username ?? result.user.email!.split("@")[0];
    return {
      data: {
        data: {
          user: {
            id: result.user.id,
            email: result.user.email!,
            username,
            createdAt: result.user.created_at,
          },
          token: result.session.access_token,
        },
      },
    };
  },

  getProfile: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Não autenticado.");
    return { data: { data: data.user } };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
};

// ─── Questions ───────────────────────────────────────────────────────────────

export const questionsApi = {
  getRandom: async () => {
    const userId = await getCurrentUserId();

    const { count } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const skip = Math.floor(Math.random() * (count || 1));

    const { data: questions, error } = await supabase
      .from("questions")
      .select("*, votes(choice, user_id)")
      .eq("is_active", true)
      .range(skip, skip);

    if (error || !questions?.length) throw new Error("Nenhuma pergunta disponível.");
    const q = questions[0];
    return { data: { data: formatQuestion(q, q.votes ?? [], userId) } };
  },

  getById: async (id: string) => {
    const userId = await getCurrentUserId();
    const { data: q, error } = await supabase
      .from("questions")
      .select("*, votes(choice, user_id)")
      .eq("id", id)
      .single();

    if (error || !q) throw new Error("Pergunta não encontrada.");
    return { data: { data: formatQuestion(q, q.votes ?? [], userId) } };
  },

  getTrending: async (limit = 5) => {
    const userId = await getCurrentUserId();
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*, votes(choice, user_id)")
      .eq("is_active", true)
      .limit(limit);

    if (error) throw new Error(error.message);

    const sorted = (questions ?? [])
      .map((q) => ({ ...formatQuestion(q, q.votes ?? [], userId), _count: q.votes?.length ?? 0 }))
      .sort((a, b) => b._count - a._count);

    return { data: { data: sorted } };
  },

  getRanking: async (page = 1, limit = 10) => {
    const userId = await getCurrentUserId();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: questions, count, error } = await supabase
      .from("questions")
      .select("*, votes(choice, user_id)", { count: "exact" })
      .eq("is_active", true)
      .range(from, to);

    if (error) throw new Error(error.message);

    const formatted = (questions ?? [])
      .map((q) => ({ ...formatQuestion(q, q.votes ?? [], userId), _voteCount: q.votes?.length ?? 0 }))
      .sort((a, b) => b._voteCount - a._voteCount);

    const total = count ?? 0;
    return {
      data: {
        data: {
          data: formatted,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  },

  getHistory: async (page = 1) => {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Não autenticado.");

    const limit = 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: votes, count, error } = await supabase
      .from("votes")
      .select("id, choice, created_at, question:questions(*, votes(choice, user_id))", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    const data = (votes ?? []).map((v) => ({
      voteId: v.id,
      choice: v.choice,
      votedAt: v.created_at,
      question: formatQuestion(v.question as unknown as Record<string, unknown>, (v.question as unknown as { votes: { choice: string; user_id: string }[] })?.votes ?? [], userId),
    }));

    const total = count ?? 0;
    return {
      data: {
        data: {
          data,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  },

  create: async (form: { text: string; optionA: string; optionB: string; category: string }) => {
    const userId = await getCurrentUserId();
    const { data: q, error } = await supabase
      .from("questions")
      .insert({
        text: form.text,
        option_a: form.optionA,
        option_b: form.optionB,
        category: form.category,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data: { data: formatQuestion(q, []) } };
  },
};

// ─── Votes ───────────────────────────────────────────────────────────────────

export const votesApi = {
  cast: async (questionId: string, choice: "A" | "B") => {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from("votes")
      .insert({ question_id: questionId, choice, user_id: userId });

    if (error) {
      if (error.code === "23505") throw new Error("Você já votou nesta pergunta.");
      throw new Error(error.message);
    }

    const { data: votes } = await supabase
      .from("votes")
      .select("choice")
      .eq("question_id", questionId);

    const stats = calcStats(votes ?? []);
    return { data: { data: { vote: { choice }, stats } } };
  },
};
