import { Book, VideoEpisode, CommunityPost } from '@/types/database';

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    slug: 'the-souls-of-black-folk',
    title: 'The Souls of Black Folk',
    author: 'W.E.B. Du Bois',
    description: 'A foundational masterpiece of African-American and Pan-African thought. Written in 1903, Du Bois introduces the profound concepts of "double consciousness" and the "veil", presenting essays combining sociology, autobiographical lyricism, and spiritual music.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    genre: 'Pan-African & Social Thought',
    is_free: true,
    rights_status: 'Public Domain (First published 1903)',
    file_type: 'pdf',
    source_key: 'books/the-souls-of-black-folk.pdf',
    status: 'published',
    page_count: 214,
    featured: true,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    chapters: [
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        book_id: 'b1111111-1111-1111-1111-111111111111',
        number: 1,
        title: 'Chapter I: Of Our Spiritual Strivings',
        content_html: `<p class="lead">Between me and the other world there is ever an unasked question: unasked by some through feelings of delicacy; by others through the half-embarrassed terror of framing it. All, nevertheless, flutter round it.</p>
<p>They approach me in a half-hesitant sort of way, eye me curiously or compassionately, and then, instead of saying directly, <em>How does it feel to be a problem?</em> they say, I know an excellent colored man in my town; or, I fought at Mechanicsville; or, Do not these Southern outrages make your blood boil? At these I smile, or am interested, or reduce the boiling to a simmer, as the occasion may require. To the real question, <em>How does it feel to be a problem?</em> I answer seldom a word.</p>
<p>And yet, being a problem is a strange experience,—peculiar even for one who has never been anything else, save perhaps in babyhood and in Europe. It is in the early days of rollicking boyhood that the revelation first bursts upon one, all in a day, as it were.</p>
<p>I remember well when the shadow swept across me. I was a little thing, away up in the hills of New England, where the dark Housatonic winds between Hoosac and Taghkanic to the sea. In a wee wooden schoolhouse, something put it into the boys' and girls' heads to buy gorgeous visiting-cards—ten cents a package—and exchange. The exchange was merry, till one girl, a tall newcomer, refused my card,—refused it peremptorily, with a glance. Then it dawned upon me with a certain suddenness that I was different from the others; or like, mayhap, in heart and life and longing, but shut out from their world by a vast veil.</p>
<p>I had thereafter no desire to tear down that veil, to creep through; I held all beyond it in common contempt, and lived above it in a region of blue sky and great wandering shadows. That sky was bluest when I could beat my mates at examination-time, or beat them at a foot-race, or even beat their stringy heads. Alas, with the years all this fine contempt began to fade; for the worlds I longed for, and all their dazzling opportunities, were theirs, not mine.</p>
<p>After the Egyptian and Indian, the Greek and Roman, the Teuton and Mongolian, the Negro is a sort of seventh son, born with a veil, and gifted with second-sight in this American world,—a world which yields him no true self-consciousness, but only lets him see himself through the revelation of the other world. It is a peculiar sensation, this double-consciousness, this sense of always looking at one's self through the eyes of others, of measuring one's soul by the tape of a world that looks on in amused contempt and pity.</p>`,
        duration_seconds: 740,
        created_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'c1111111-1111-1111-1111-111111111112',
        book_id: 'b1111111-1111-1111-1111-111111111111',
        number: 2,
        title: 'Chapter II: Of the Dawn of Freedom',
        content_html: `<p class="lead">The problem of the twentieth century is the problem of the color-line,—the relation of the darker to the lighter races of men in Asia and Africa, in America and the islands of the sea.</p>
<p>It was a phase of this problem that caused the Civil War; and however much they who marched to the front may have held the quest of human freedom as incidental or irrelevant, the question of the slave was the ultimate cause.</p>
<p>The nation has not yet found peace from its sins; the Freedman has not yet found in freedom his promised land. Whatever of good may have come in these years of change, the shadow of a deep disappointment rests upon the Negro people,—a disappointment all the more sensible because they are forbidden to talk of it, or write of it, or even grieve for it in the quiet recesses of their hearts.</p>
<p>Swarthy-faced people of the Caribbean and the Congo, children of the soil whose sweat built the great ports of Liverpool and Charleston, watched as the shackles fell. Yet the new dawn was clouded with economic bondage, peonage, and the disenfranchisement of the vote.</p>`,
        duration_seconds: 860,
        created_at: '2026-10-01T00:00:00Z',
      }
    ]
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    slug: 'myths-and-legends-of-the-bantu',
    title: 'Myths and Legends of the Bantu',
    author: 'Alice Werner',
    description: 'An extraordinary gathering of oral traditions, ancestral cosmologies, celestial stories, and clever trickster chronicles collected across East, Central, and Southern Africa. Includes stories of the giant reed bed of creation, the messages sent through the Chameleon, and the animal parliament.',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    genre: 'African Folklore & Mythology',
    is_free: true,
    rights_status: 'Public Domain (First published 1933)',
    file_type: 'pdf',
    source_key: 'books/myths-and-legends-of-the-bantu.pdf',
    status: 'published',
    page_count: 342,
    featured: true,
    created_at: '2026-10-02T00:00:00Z',
    updated_at: '2026-10-02T00:00:00Z',
    chapters: [
      {
        id: 'c2222222-2222-2222-2222-222222222221',
        book_id: 'b2222222-2222-2222-2222-222222222222',
        number: 1,
        title: 'Chapter I: The Origin of Man and the Nature of the World',
        content_html: `<p class="lead">The Bantu peoples, who occupy the greater part of the African continent south of the equator, possess a rich legacy of myth explaining how the cosmos was ordered and how humanity arrived upon the green earth.</p>
<p>In the oldest stories of the Zulus and Thonga, humanity did not descend from the clouds, but burst forth from a giant reed bed—<em>u-hlanga</em>—by the river banks. When Unkulunkulu, the Old-Old One, broke from the reed, men and women of all tribes stepped forth behind him, bringing with them cattle, iron spears, and the grains of the soil.</p>
<p>To the early Bantu mind, the universe was alive with spirit and intention. Rocks breathed; the deep pools of the Zambezi held water spirits; and the python was treated as an emissary between the worlds of the living and the ancestors resting beneath the earth.</p>`,
        duration_seconds: 620,
        created_at: '2026-10-02T00:00:00Z',
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        book_id: 'b2222222-2222-2222-2222-222222222222',
        number: 2,
        title: 'Chapter II: The Message That Failed and the Origin of Death',
        content_html: `<p class="lead">In almost every Bantu land, from the rolling grasslands of Natal to the shores of Lake Victoria, one encounters the tragedy of the Chameleon and the Lizard.</p>
<p>In the beginning, it was not decreed that humans should die. The Creator sent forth the Chameleon with the supreme message of eternal life: <em>"Go to men and say: Men shall not die!"</em> But the Chameleon walked with deliberate slowness, stopping to catch flies and changing his skin from green to gold upon the forest paths.</p>
<p>Impatient with the silence, the Creator then sent the fleet-footed Lizard with a terrible countermand: <em>"Tell men they must die."</em> The swift Lizard ran without pause, delivered the news of mortality, and when the Chameleon arrived hours later with the gift of immortality, the elders wept: <em>"We have accepted the word of the Lizard."</em></p>`,
        duration_seconds: 540,
        created_at: '2026-10-02T00:00:00Z',
      }
    ]
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    slug: 'narrative-of-the-life-of-frederick-douglass',
    title: 'Narrative of the Life of Frederick Douglass',
    author: 'Frederick Douglass',
    description: 'The monumental 1845 autobiography of Frederick Douglass. Moving with searing clarity through his youth under plantation bondage in Maryland, his clandestine acquisition of reading, and his dangerous flight north into freedom.',
    cover_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    genre: 'Historical Autobiography',
    is_free: true,
    rights_status: 'Public Domain (First published 1845)',
    file_type: 'pdf',
    source_key: 'books/narrative-frederick-douglass.pdf',
    status: 'published',
    page_count: 128,
    featured: true,
    created_at: '2026-10-03T00:00:00Z',
    updated_at: '2026-10-03T00:00:00Z',
    chapters: [
      {
        id: 'c3333333-3333-3333-3333-333333333331',
        book_id: 'b3333333-3333-3333-3333-333333333333',
        number: 1,
        title: 'Chapter I: Origins in Tuckahoe',
        content_html: `<p class="lead">I was born in Tuckahoe, near Hillsborough, and about twelve miles from Easton, in Talbot county, Maryland. I have no accurate knowledge of my age, never having seen any authentic record containing it.</p>
<p>By far the larger part of the slaves know as little of their ages as horses know of theirs, and it is the wish of most masters within my knowledge to keep their slaves thus ignorant. I do not remember to have ever met a slave who could tell of his birthday. They seldom come nearer to it than planting-time, harvest-time, cherry-time, spring-time, or fall-time.</p>
<p>My mother was named Harriet Bailey. She was the daughter of Isaac and Betsey Bailey, both colored, and quite dark. My father was a white man. He was admitted to be such by all I ever heard speak of my parentage. The opinion was also whispered that my master was my father; but of the correctness of this opinion, I know nothing.</p>`,
        duration_seconds: 680,
        created_at: '2026-10-03T00:00:00Z',
      }
    ]
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    slug: 'the-prophet',
    title: 'The Prophet',
    author: 'Kahlil Gibran',
    description: 'A poetic and philosophical sanctuary in prose. The prophet Almustafa, before boarding his ship home after twelve years in the foreign city of Orphalese, imparts timeless teachings on love, freedom, friendship, joy, sorrow, and time.',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    genre: 'Philosophy & Poetry',
    is_free: false, // Premium / Members book! Chapter 1 is preview, Chapter 2 is gated
    rights_status: 'Public Domain (First published 1923)',
    file_type: 'pdf',
    source_key: 'books/the-prophet.pdf',
    status: 'published',
    page_count: 96,
    featured: false,
    created_at: '2026-10-04T00:00:00Z',
    updated_at: '2026-10-04T00:00:00Z',
    chapters: [
      {
        id: 'c4444444-4444-4444-4444-444444444441',
        book_id: 'b4444444-4444-4444-4444-444444444444',
        number: 1,
        title: 'Chapter I: The Coming of the Ship (Free Preview)',
        content_html: `<p class="lead">Almustafa, the chosen and the beloved, who was a dawn unto his own day, had waited twelve years in the city of Orphalese for his ship that was to return and bear him back to the isle of his birth.</p>
<p>And in the twelfth year, on the seventh day of Ielool, the month of reaping, he climbed the hill without the city walls and looked seaward; and he beheld his ship coming with the mist. Then the gates of his heart were flung open, and his joy flew far over the sea. And he closed his eyes and prayed in the silences of his soul.</p>
<p>But as he descended the hill, a sadness came upon him, and he thought in his heart: <em>How shall I go in peace and without sorrow? Nay, not without a wound in the spirit shall I leave this city. Long were the days of pain I have spent within its walls, and long were the nights of aloneness; and who can depart from his pain and his aloneness without regret?</em></p>`,
        duration_seconds: 420,
        created_at: '2026-10-04T00:00:00Z',
      },
      {
        id: 'c4444444-4444-4444-4444-444444444442',
        book_id: 'b4444444-4444-4444-4444-444444444444',
        number: 2,
        title: 'Chapter II: On Love & Giving (Members Only)',
        content_html: `<p class="lead">Then said Almitra, Speak to us of Love. And he raised his head and looked upon the people, and there fell a stillness upon them. And with a great voice he said:</p>
<p>When love beckons to you, follow him, though his ways are hard and steep. And when his wings enfold you yield to him, though the sword hidden among his pinions may wound you. And when he speaks to you believe in him, though his voice may shatter your dreams as the north wind lays waste the garden.</p>
<p>For even as love crowns you so shall he crucify you. Even as he is for your growth so is he for your pruning. Even as he ascends to your height and caresses your tenderest branches that quiver in the sun, so shall he descend to your roots and shake them in their clinging to the earth.</p>`,
        duration_seconds: 510,
        created_at: '2026-10-04T00:00:00Z',
      }
    ]
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    slug: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'Jane Austen’s sparkling study of social choreography, courtship, pride, and misconception. Through the banter of Elizabeth Bennet and Fitzwilliam Darcy, Austen examines family pride, class pretensions, and independence of spirit.',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    genre: 'Classic Literature & Romance',
    is_free: false, // Premium / Members book
    rights_status: 'Public Domain (First published 1813)',
    file_type: 'pdf',
    source_key: 'books/pride-and-prejudice.pdf',
    status: 'published',
    page_count: 432,
    featured: false,
    created_at: '2026-10-05T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
    chapters: [
      {
        id: 'c5555555-5555-5555-5555-555555555551',
        book_id: 'b5555555-5555-5555-5555-555555555555',
        number: 1,
        title: 'Chapter I: A Truth Universally Acknowledged (Free Preview)',
        content_html: `<p class="lead">It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>
<p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
<p>"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"</p>
<p>Mr. Bennet replied that he had not.</p>
<p>"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."</p>
<p>Mr. Bennet made no answer.</p>
<p>"Do you not want to know who has taken it?" cried his wife impatiently.</p>
<p>"<em>You</em> want to tell me, and I have no objection to hearing it."</p>`,
        duration_seconds: 490,
        created_at: '2026-10-05T00:00:00Z',
      },
      {
        id: 'c5555555-5555-5555-5555-555555555552',
        book_id: 'b5555555-5555-5555-5555-555555555555',
        number: 2,
        title: 'Chapter II: The Netherfield Assembly (Members Only)',
        content_html: `<p class="lead">Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.</p>
<p>The rest of the evening was spent in conjecturing how soon he would return Mr. Bennet's visit, and determining when they should ask him to dinner.</p>`,
        duration_seconds: 530,
        created_at: '2026-10-05T00:00:00Z',
      }
    ]
  }
];

export const MOCK_VIDEOS: VideoEpisode[] = [
  {
    id: 'v1111111-1111-1111-1111-111111111111',
    title: 'Why African Mythology Should Be Your Next Reading Obsession',
    slug: 'why-african-mythology-hyperfixation',
    description: 'Take 60 seconds into the Bantu creation epic: the reed bed of u-hlanga, the tortoise that outwitted the python, and why the Chameleon was late with eternal life.',
    stream_uid: 'bantu_mythology_reel_01',
    book_id: 'b2222222-2222-2222-2222-222222222222',
    author_name: 'SuperBooks Editorial',
    episode_number: 1,
    status: 'published',
    view_count: 1420,
    created_at: '2026-10-06T00:00:00Z',
  },
  {
    id: 'v2222222-2222-2222-2222-222222222222',
    title: '3 Quotes from W.E.B. Du Bois That Will Reshape How You Think',
    slug: 'three-quotes-web-du-bois',
    description: 'Double consciousness explained with stark modern urgency. Why "The Souls of Black Folk" hits harder in the digital age than ever before.',
    stream_uid: 'web_du_bois_quotes_02',
    book_id: 'b1111111-1111-1111-1111-111111111111',
    author_name: 'Amara Kalu',
    episode_number: 2,
    status: 'published',
    view_count: 2890,
    created_at: '2026-10-06T00:00:00Z',
  },
  {
    id: 'v3333333-3333-3333-3333-333333333333',
    title: 'Scroll or Flip? The Tactile SuperBooks Reader Experience',
    slug: 'smooth-scroll-vs-page-flip',
    description: 'Dual reading mode in action: turn the page with genuine mobile physics, paper rustle audio, and synchronized speed-controlled chapter audio.',
    stream_uid: 'reader_mode_showcase_03',
    book_id: null,
    author_name: 'Studio Dispatch',
    episode_number: 3,
    status: 'published',
    view_count: 3910,
    created_at: '2026-10-07T00:00:00Z',
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    book_id: 'b1111111-1111-1111-1111-111111111111',
    title: 'The sorrow songs at the start of each chapter in Souls of Black Folk',
    content: 'Has anyone else noticed that Du Bois chose musical notation bars rather than poetry lines for the epigraphs? Hearing the audio player while looking at the notes adds a completely different emotional frequency to the text.',
    likes_count: 34,
    created_at: '2026-10-07T14:20:00Z',
    updated_at: '2026-10-07T14:20:00Z',
    author: {
      id: 'u1111111-1111-1111-1111-111111111111',
      display_name: 'Ngozi Achebe',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'reader',
      bio: 'Lover of West African literature, historical essays, and print typography.',
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z'
    },
    comments: [
      {
        id: 'cm111111-1111-1111-1111-111111111111',
        post_id: 'p1111111-1111-1111-1111-111111111111',
        user_id: 'u2222222-2222-2222-2222-222222222222',
        content: 'Yes! He considered the spirituals the greatest gift of America to world art. It binds the oral and written worlds together.',
        likes_count: 12,
        created_at: '2026-10-07T15:10:00Z',
        author: {
          id: 'u2222222-2222-2222-2222-222222222222',
          display_name: 'Kwame Mensah',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          role: 'reader',
          bio: 'Literature educator based in Accra.',
          created_at: '2026-10-02T00:00:00Z',
          updated_at: '2026-10-02T00:00:00Z'
        }
      }
    ]
  }
];
