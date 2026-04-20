import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    text: "Você prefere ganhar R$1 milhão agora ou trabalhar 10 anos e acumular R$10 milhões?",
    optionA: "R$1 milhão agora",
    optionB: "R$10 milhões em 10 anos",
    category: "dinheiro",
  },
  {
    text: "Você prefere ter superpoderes mas não poder contar para ninguém, ou ser famoso mundialmente sem superpoderes?",
    optionA: "Ter superpoderes em segredo",
    optionB: "Ser famoso mundialmente",
    category: "fantasias",
  },
  {
    text: "Você prefere viver 100 anos com saúde mediana ou 60 anos com saúde perfeita?",
    optionA: "100 anos com saúde mediana",
    optionB: "60 anos com saúde perfeita",
    category: "vida",
  },
  {
    text: "Você prefere poder voar ou ser invisível?",
    optionA: "Poder voar",
    optionB: "Ser invisível",
    category: "fantasias",
  },
  {
    text: "Você prefere morar em uma grande cidade agitada ou no campo em total paz?",
    optionA: "Grande cidade agitada",
    optionB: "Campo em total paz",
    category: "estilo de vida",
  },
  {
    text: "Você prefere saber como vai morrer ou quando vai morrer?",
    optionA: "Como vai morrer",
    optionB: "Quando vai morrer",
    category: "existencial",
  },
  {
    text: "Você prefere ter a habilidade de falar todos os idiomas do mundo ou tocar qualquer instrumento musical perfeitamente?",
    optionA: "Falar todos os idiomas",
    optionB: "Tocar qualquer instrumento",
    category: "habilidades",
  },
  {
    text: "Você prefere nunca mais precisar dormir ou nunca mais sentir fome?",
    optionA: "Nunca mais dormir",
    optionB: "Nunca mais sentir fome",
    category: "fantasias",
  },
  {
    text: "Você prefere viajar para o passado ou para o futuro?",
    optionA: "Viajar para o passado",
    optionB: "Viajar para o futuro",
    category: "fantasia",
  },
  {
    text: "Você prefere ter muito dinheiro mas trabalhar 80h por semana, ou ganhar pouco mas ter todo o tempo livre?",
    optionA: "Muito dinheiro, 80h/semana",
    optionB: "Pouco dinheiro, tempo livre",
    category: "trabalho",
  },
  {
    text: "Você prefere ser o mais inteligente do mundo ou o mais feliz?",
    optionA: "Ser o mais inteligente",
    optionB: "Ser o mais feliz",
    category: "existencial",
  },
  {
    text: "Você prefere viver sem internet ou sem televisão?",
    optionA: "Viver sem internet",
    optionB: "Viver sem televisão",
    category: "tecnologia",
  },
  {
    text: "Você prefere comer sua comida favorita todo dia pelo resto da vida ou nunca comer ela novamente?",
    optionA: "Comer todo dia para sempre",
    optionB: "Nunca comer novamente",
    category: "dilemas",
  },
  {
    text: "Você prefere ter a memória de um elefante ou a velocidade de um guepardo?",
    optionA: "Memória de elefante",
    optionB: "Velocidade de guepardo",
    category: "habilidades",
  },
  {
    text: "Você prefere ser famoso e pobre ou rico e anônimo?",
    optionA: "Famoso e pobre",
    optionB: "Rico e anônimo",
    category: "vida",
  },
];

async function main() {
  console.log("Iniciando seed do banco de dados...");

  await prisma.question.deleteMany();
  console.log("Perguntas antigas removidas.");

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }

  console.log(`${questions.length} perguntas criadas com sucesso!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
