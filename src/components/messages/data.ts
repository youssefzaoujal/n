/**
 * Les mots doux laissés par les amies (dans l'ordre de lecture) et la lettre finale de Youssef.
 * Pour ajouter un mot : copie un bloc { text: `…` } et colle le message entre les accents graves.
 * Pour un message en arabe, ajoute rtl: true.
 */
export interface FriendMessage {
  /** Petite phrase-indice affichée avant le mot (pour aider à deviner). */
  hint: string;
  text: string;
  rtl?: boolean;
}

export const friendMessages: FriendMessage[] = [
  {
    hint: "Quelqu’un qui partage ta vie depuis tant d’années…",
    text: `Après toutes ces années, on a partagé tellement de choses, de souvenirs, de discussions et de moments précieux que je garderai toujours dans mon cœur.

Tu es bien plus qu’une amie, tu es ma confidente, mon repère, ma sœur de cœur. Peu importe le temps qui passe, tu garderas toujours une place toute particulière dans ma vie.

À toutes ces années passées ensemble et surtout à toutes celles qui nous attendent encore. Joyeux anniversaire ! ❤️`,
  },
  {
    hint: "Quelqu’un qui t’aime depuis treize ans…",
    rtl: true,
    text: `🌻شي ناس كيدوزو فحياتنا، وشي ناس كيسكنو فالقلب. ❤️نتي سكنتي و شديتي بلاصتك للأبد. 13 عام ديال العشرة النقية، وكنشهد قدام الله اني ما شفت منك غير الزوين🥹.

نتي special ديالي، الأولى والأخيرة. الله يخليك ليا. الله يرزقك فرحة ما كتسالاش، وراحة البال، ويخليك ديما منورة. ويا ربي نبقاو صحابات حتى للجنة.❤️🥰`,
  },
  {
    hint: "Quelqu’un qui a séché tes larmes, ces quatre dernières années…",
    text: `To the shoulder I always lean on, to the hands that have wiped away my tears, to the embrace that has sheltered me from my own tribulations, and to the eyes that have always comforted me: I wish you the happiest of birthdays, my Noughi d’amour ❤️❤️

May this year bring you all the comfort, happiness, and prosperity your heart desires. These past four years have been filled with new adventures, and I’m so thrilled to have experienced them by your side. We’ve been through so much, and I’m so glad we’ve always stuck together. Now we’re practically glued to one another. Hsaltii!!

I’m so grateful to have you in my life and to be able to call you a friend — although I’d much rather call you a sister. Thank you for always being there for me, for listening to me cry for hours about the same subject for the 283830030th time, for going along with my random ideas, for bearing with my little whims, for making me laugh until my cheeks hurt, and, above all, for always being unapologetically YOU!!

Happy birthday, sunshine. I love you so, so much! !! Lah ykhalina n baetna wlah ykhalina dima mjmeuin chhal mafarqtna dunya ❤️❤️

Bisous maxxx`,
  },
  {
    hint: "Quelqu’un pour qui le temps n’a fait que rendre votre amitié plus forte…",
    text: `They say some friendships lose their beauty over time, but ours has proved otherwise. We are growing together without growing apart, and I'm truly proud that our friendship is one of those rare ones that only gets stronger with time.

I'm truly grateful for this friendship, where we can always be our authentic selves, feel completely comfortable, and find a safe space amid life's challenges.

I hope you feel as happy and special today as you make the people around you feel. May life bring you all the happiness you deserve, because you deserve the best.

P.S. I'm still waiting for my share of 🍫

Happy Birthday! ❤️`,
  },
  {
    hint: "Quelqu’un qui a vu tes yeux briller le jour où il est entré dans ta vie…",
    text: `Happiest birthday to a truly wonderful soul,
I am so grateful to have you Noughi❤️,
May life always surprise you with blessings, happiness and moments as beautiful as you are.

I've always seen how kind, how loving you are, how much you’ve got to offer, and how deserving you are of a love that makes you feel truly happy. I always hoped someone would come along and see how beautiful you are inside and out. And now, watching how happy you are, how your face lights up and your eyes sparkle since the day ✨Sidi Youssef✨ came into your life, it’s such a beautiful thing to witness. Nothing makes me happier than seeing you receive the happiness you've always deserved. May this be just the beginning of a lifetime of beautiful moments. You deserve every bit of it ❤️❤️❤️`,
  },
  {
    hint: "",
    text: `Ma très chère et douce Nouhati ,

Aujourd’hui est un grand jour , tu viens d’accéder à la deuxième moitié de tes vingtaines, ces vingtaines où on grandi, on apprend , on se trompe et on découvre de belles choses et d’autres un peu moins … On apprend à se connaître soit même et se faire face quand il le faut . Ce qui est sûr c’est que les meilleurs rencontres sont celles des vingtaines et les amies qu’on se fait à cet âge là sont celles qui témoignent de notre vraie évolution vers l’âge adulte . Durant ces années je t’ai vu fleurir , grandir, pétiller de bonheur et d’espoir mais aussi de bon sens et de sagesse .

Merci d’illuminer nos vies par ta douceur et ta bienveillance , tu es notre rayon de soleil qui embaume nos journées 💕

À nos 6 ans d’amitié , de rires et de larmes , à ces 25 printemps que tu embellis ce monde et finalement à tout une vie pleine de bonheur et d’amour 💕

Je t’aime fort sadikatiiiiii ♥️`,
  },
  {
    hint: "",
    text: `Joyeux anniversaire Nouhitaass dyali ♥️♥️

Lah ydakhal elik had 3am b saha o salama avec beaucoup de réussite et de succès dans tout ce que tu entreprends inxa2allah .

7na kamlin mejmou3in lyouma bax nxofo dahka ela wejhek o lah ykhalik dima farahana o lah ysser lek f ayi hj katmnaha o lah ykhalik lilna o nbqaw daiman mejmou3in Inxa2allah

O mabaqi walo ya haneteb3ek ana n almania awla tba3ni tn n la France .

Je t’aime fort habibati, enjoy your day to the fullest! 🥹🫶🏻`,
  },
];

/** La lettre de Youssef, lue ligne par ligne à la fin. La première ligne sert de titre. */
export const youssefTitle = "11.11 ❤️🎂 | Happy Birthday, My Love.";

export const youssefLines: string[] = [
  "11.11… ❤️",
  "Have you ever looked at these numbers et tu t'es déjà demandé pourquoi ils sont aussi beaux ensemble ?",
  "Two ones, standing side by side… comme deux âmes, un homme et une femme, qui choisissent d'avancer ensemble, hand in hand, heart to heart. 🥹❤️",
  "Maybe that's why they call 11/11 the International Day of Love. Parce que l'amour, ce n'est pas simplement deux personnes qui se regardent… it's about two hearts standing together, facing the same future. ❤️",
  "Mais tu sais ce qui rend cette date even more magical to me ? C'est que le jour où the whole world celebrates love, c'est aussi le jour où toi, mon plus bel amour, tu es née. 🥹❤️",
  "And I don't believe that's just a coincidence. Peut-être que l'univers savait qu'une personne aussi belle que toi deserved to be born on a day dedicated to love itself.",
  "They say 11:11 is the perfect time to make a wish… Mais comment pourrais-je demander quelque chose de plus à l'univers, when the most beautiful wish of my life is already you? ❤️",
  "Si on me demandait what I love the most about you, je ne saurais même pas par où commencer. Ton sourire, tes yeux, ta douceur, ton cœur, all those little details that make you YOU… everything about you makes my world a little more beautiful.",
  "And if I could give you one gift today, ce serait de te permettre de te voir à travers mes yeux, just for a moment. Pour que tu comprennes enfin how precious, beautiful and irreplaceable you are to me.",
  "Happy Birthday, my beautiful girl, mon amour, my favorite person. 🎂❤️",
  "Je prie pour que every dream you carry in your heart devienne réalité, que la vie te protège, qu'elle t'offre all the happiness you deserve, et que ton magnifique sourire never fades away.",
  "And in this life, dans une autre vie, in a thousand different lives… je te retrouverais, I would still choose you, et je retomberais amoureux de toi. Every. Single. Time. ❤️",
  "Aujourd'hui, the whole world celebrates love once a year… mais moi, I celebrate loving you every single day, à chaque instant, with every heartbeat.",
  "11.11 — The day the world celebrates love, et le jour où ma personne préférée au monde est née. ❤️♾️",
  "Je t'aime d'un amour that even the most beautiful words in the world could never fully describe.",
  "Attends, attends, mon amour… ❤️ Before I finish, j’ai un petit message pour tes amies qui sont avec toi aujourd’hui… Girls, j’ai juste une petite chose à vous dire… 🥹❤️",
  "Nouha is not just someone special to me, hiya amana entre vos mains. 🥹❤️",
  "Alors thalaw fiha svp, take good care of her, faites-la rire, entourez-la d’amour et surtout, make sure that beautiful smile never leaves her face.",
  "Because you're not just celebrating her birthday today… you're celebrating someone who means the whole world to me. ❤️",
  "Happy Birthday, mon amour. You are my 11:11 wish that came true. 🥹❤️🎂",
];

/** Les 3 questions pour ouvrir le coffre : la réponse à écrire est toujours « Youssef » (majuscules ou minuscules). */
export const ANSWER = "youssef";

export const questions = [
  { q: "Who loves Nouha the most in this world?", wrong: "Hmm… non 😏 Réfléchissez bien, c'est un homme…" },
  { q: "Who is the luckiest man alive because he has Nouha?", wrong: "Pas du tout 😂 Indice : il est fou d'elle…" },
  { q: "Who thinks Nouha is the most beautiful girl in the universe?", wrong: "Toujours pas 🙈 Indice : son prénom commence par Y…" },
];

/** Musique de fond, en boucle, du coffre jusqu'à la fin (Passacaglia, Handel/Halvorsen). */
export const MUSIC = "/media/passacaglia.mp3";

