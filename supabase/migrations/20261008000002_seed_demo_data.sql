-- SuperBooks: Production Migration 02 - Seed Demo Data
-- Seeds 5 public domain books with rich chapters and 3 Booktok video entries

DO $$
DECLARE
    v_book1_id UUID := gen_random_uuid();
    v_book2_id UUID := gen_random_uuid();
    v_book3_id UUID := gen_random_uuid();
    v_book4_id UUID := gen_random_uuid();
    v_book5_id UUID := gen_random_uuid();
BEGIN

-- 1. Book 1: The Souls of Black Folk (Free)
INSERT INTO public.books (
    id, slug, title, author, description, cover_url, language, genre, 
    is_free, rights_status, file_type, status, page_count, featured
) VALUES (
    v_book1_id,
    'the-souls-of-black-folk',
    'The Souls of Black Folk',
    'W.E.B. Du Bois',
    'A seminal cornerstone of African-American literature and sociological thought. Published in 1903, Du Bois introduces the concepts of "double consciousness" and the "veil", exploring the spiritual and civil existence of Black humanity at the dawn of the twentieth century.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'en',
    'African Diaspora & Thought',
    true,
    'Public Domain (First published 1903)',
    'pdf',
    'published',
    214,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Chapters for Book 1
INSERT INTO public.chapters (book_id, number, title, content_html, duration_seconds) VALUES
(
    v_book1_id,
    1,
    'Chapter I: Of Our Spiritual Strivings',
    '<p class="lead">Between me and the other world there is ever an unasked question: unasked by some through feelings of delicacy; by others through the half-embarrassed terror of framing it. All, nevertheless, flutter round it.</p><p>They approach me in a half-hesitant sort of way, eye me curiously or compassionately, and then, instead of saying directly, <em>How does it feel to be a problem?</em> they say, I know an excellent colored man in my town; or, I fought at Mechanicsville; or, Do not these Southern outrages make your blood boil? At these I smile, or am interested, or reduce the boiling to a simmer, as the occasion may require. To the real question, <em>How does it feel to be a problem?</em> I answer seldom a word.</p><p>And yet, being a problem is a strange experience,—peculiar even for one who has never been anything else, save perhaps in babyhood and in Europe. It is in the early days of rollicking boyhood that the revelation first bursts upon one, all in a day, as it were.</p><p>I remember well when the shadow swept across me. I was a little thing, away up in the hills of New England, where the dark Housatonic winds between Hoosac and Taghkanic to the sea. In a wee wooden schoolhouse, something put it into the boys'' and girls'' heads to buy gorgeous visiting-cards—ten cents a package—and exchange. The exchange was merry, till one girl, a tall newcomer, refused my card,—refused it peremptorily, with a glance. Then it dawned upon me with a certain suddenness that I was different from the others; or like, mayhap, in heart and life and longing, but shut out from their world by a vast veil.</p><p>I had thereafter no desire to tear down that veil, to creep through; I held all beyond it in common contempt, and lived above it in a region of blue sky and great wandering shadows. That sky was bluest when I could beat my mates at examination-time, or beat them at a foot-race, or even beat their stringy heads. Alas, with the years all this fine contempt began to fade; for the worlds I longed for, and all their dazzling opportunities, were theirs, not mine.</p>',
    740
),
(
    v_book1_id,
    2,
    'Chapter II: Of the Dawn of Freedom',
    '<p>The problem of the twentieth century is the problem of the color-line,—the relation of the darker to the lighter races of men in Asia and Africa, in America and the islands of the sea. It was a phase of this problem that caused the Civil War; and however much they who marched to the front may have held the quest of human freedom as incidental or irrelevant, the question of the slave was the ultimate cause.</p><p>The nation has not yet found peace from its sins; the Freedman has not yet found in freedom his promised land. Whatever of good may have come in these years of change, the shadow of a deep disappointment rests upon the Negro people,—a disappointment all the more sensible because they are forbidden to talk of it, or write of it, or even grieve for it in the quiet recesses of their hearts.</p>',
    860
) ON CONFLICT (book_id, number) DO NOTHING;


-- 2. Book 2: Myths and Legends of the Bantu (Free)
INSERT INTO public.books (
    id, slug, title, author, description, cover_url, language, genre, 
    is_free, rights_status, file_type, status, page_count, featured
) VALUES (
    v_book2_id,
    'myths-and-legends-of-the-bantu',
    'Myths and Legends of the Bantu',
    'Alice Werner',
    'A breathtaking anthology of folklore, cosmologies, ancestral trickster tales, and oral traditions collected across Central, Eastern, and Southern Bantu-speaking peoples. Includes the famous tales of the origin of death, the clever Hare, and cosmic celestial legends.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'en',
    'African Folklore & Mythology',
    true,
    'Public Domain (First published 1933)',
    'pdf',
    'published',
    342,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Chapters for Book 2
INSERT INTO public.chapters (book_id, number, title, content_html, duration_seconds) VALUES
(
    v_book2_id,
    1,
    'Chapter I: The Origin of Man and the Nature of the World',
    '<p class="lead">The Bantu peoples, who occupy the greater part of the African continent south of the equator, possess a rich legacy of myth explaining how the cosmos was ordered and how humanity arrived upon the green earth.</p><p>In the oldest stories of the Zulus and Thonga, humanity did not descend from the clouds, but burst forth from a giant reed bed—<em>u-hlanga</em>—by the river banks. When Unkulunkulu, the Old-Old One, broke from the reed, men and women of all tribes stepped forth behind him, bringing with them cattle, iron spears, and the grains of the soil.</p><p>To the early Bantu mind, the universe was alive with spirit and intention. Rocks breathed; the deep pools of the Zambezi held water spirits; and the python was treated as an emissary between the worlds of the living and the ancestors resting beneath the earth.</p>',
    620
),
(
    v_book2_id,
    2,
    'Chapter II: The Message That Failed and the Origin of Death',
    '<p>In almost every Bantu land, from the rolling grasslands of Natal to the shores of Lake Victoria, one encounters the tragedy of the Chameleon and the Lizard.</p><p>In the beginning, it was not decreed that humans should die. The Creator sent forth the Chameleon with the supreme message of eternal life: <em>"Go to men and say: Men shall not die!"</em> But the Chameleon walked with deliberate slowness, stopping to catch flies and changing his skin from green to gold upon the forest paths.</p><p>Impatient with the silence, the Creator then sent the fleet-footed Lizard with a terrible countermand: <em>"Tell men they must die."</em> The swift Lizard ran without pause, delivered the news of mortality, and when the Chameleon arrived hours later with the gift of immortality, the elders wept: <em>"We have accepted the word of the Lizard."</em></p>',
    540
) ON CONFLICT (book_id, number) DO NOTHING;


-- 3. Book 3: Narrative of the Life of Frederick Douglass (Free)
INSERT INTO public.books (
    id, slug, title, author, description, cover_url, language, genre, 
    is_free, rights_status, file_type, status, page_count, featured
) VALUES (
    v_book3_id,
    'narrative-of-the-life-of-frederick-douglass',
    'Narrative of the Life of Frederick Douglass',
    'Frederick Douglass',
    'The courageous 1845 autobiography of Frederick Douglass, recounting his youth enslaved in Maryland, his secret journey to literacy, and his daring escape north to freedom. An immortal testament to the transformative power of the written word.',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80',
    'en',
    'Historical Autobiography',
    true,
    'Public Domain (First published 1845)',
    'pdf',
    'published',
    128,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Chapters for Book 3
INSERT INTO public.chapters (book_id, number, title, content_html, duration_seconds) VALUES
(
    v_book3_id,
    1,
    'Chapter I: Origins in Tuckahoe',
    '<p class="lead">I was born in Tuckahoe, near Hillsborough, and about twelve miles from Easton, in Talbot county, Maryland. I have no accurate knowledge of my age, never having seen any authentic record containing it.</p><p>By far the larger part of the slaves know as little of their ages as horses know of theirs, and it is the wish of most masters within my knowledge to keep their slaves thus ignorant. I do not remember to have ever met a slave who could tell of his birthday.</p><p>My mother was named Harriet Bailey. She was the daughter of Isaac and Betsey Bailey, both colored, and quite dark. My mother was of a darker complexion than either my grandmother or grandfather. My father was a white man. He was admitted to be such by all I ever heard speak of my parentage. The opinion was also whispered that my master was my father; but of the correctness of this opinion, I know nothing.</p>',
    680
) ON CONFLICT (book_id, number) DO NOTHING;


-- 4. Book 4: The Prophet (Members / Gated: Chapter 1 preview only)
INSERT INTO public.books (
    id, slug, title, author, description, cover_url, language, genre, 
    is_free, rights_status, file_type, status, page_count, featured
) VALUES (
    v_book4_id,
    'the-prophet',
    'The Prophet',
    'Kahlil Gibran',
    'A masterpiece of spiritual philosophy and lyric prose consisting of 26 poetic essays delivered by the seer Almustafa before he boards his ship to return to his homeland. He reflects on Love, Marriage, Children, Giving, Work, and Freedom.',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'en',
    'Philosophy & Poetry',
    false, -- Members book!
    'Public Domain (First published 1923)',
    'pdf',
    'published',
    96,
    false
) ON CONFLICT (slug) DO NOTHING;

-- Chapters for Book 4 (Chapter 1 free preview, Chapter 2 gated)
INSERT INTO public.chapters (book_id, number, title, content_html, duration_seconds) VALUES
(
    v_book4_id,
    1,
    'The Coming of the Ship',
    '<p class="lead">Almustafa, the chosen and the beloved, who was a dawn unto his own day, had waited twelve years in the city of Orphalese for his ship that was to return and bear him back to the isle of his birth.</p><p>And in the twelfth year, on the seventh day of Ielool, the month of reaping, he climbed the hill without the city walls and looked seaward; and he beheld the ship coming with the mist. Then the gates of his heart were flung open, and his joy flew far over the sea. And he closed his eyes and prayed in the silences of his soul.</p><p>But as he descended the hill, a sadness came upon him, and he thought in his heart: <em>How shall I go in peace and without sorrow? Nay, not without a wound in the spirit shall I leave this city. Long were the days of pain I have spent within its walls, and long were the nights of aloneness; and who can depart from his pain and his aloneness without regret?</em></p>',
    420
),
(
    v_book4_id,
    2,
    'On Love & Giving (Members Only)',
    '<p class="lead">Then said Almitra, Speak to us of Love. And he raised his head and looked upon the people, and there fell a stillness upon them. And with a great voice he said:</p><p>When love beckons to you, follow him, though his ways are hard and steep. And when his wings enfold you yield to him, though the sword hidden among his pinions may wound you. And when he speaks to you believe in him, though his voice may shatter your dreams as the north wind lays waste the garden.</p><p>For even as love crowns you so shall he crucify you. Even as he is for your growth so is he for your pruning. Even as he ascends to your height and caresses your tenderest branches that quiver in the sun, so shall he descend to your roots and shake them in their clinging to the earth.</p>',
    510
) ON CONFLICT (book_id, number) DO NOTHING;


-- 5. Book 5: Pride and Prejudice (Members / Gated: Chapter 1 preview only)
INSERT INTO public.books (
    id, slug, title, author, description, cover_url, language, genre, 
    is_free, rights_status, file_type, status, page_count, featured
) VALUES (
    v_book5_id,
    'pride-and-prejudice',
    'Pride and Prejudice',
    'Jane Austen',
    'Jane Austen’s witty comedy of manners, social status, and matrimonial ambition. Follows the spirited Elizabeth Bennet as she contends with familial obligations, societal expectations, and the enigmatic Mr. Darcy.',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    'en',
    'Classic Literature & Romance',
    false, -- Members book!
    'Public Domain (First published 1813)',
    'pdf',
    'published',
    432,
    false
) ON CONFLICT (slug) DO NOTHING;

-- Chapters for Book 5
INSERT INTO public.chapters (book_id, number, title, content_html, duration_seconds) VALUES
(
    v_book5_id,
    1,
    'Chapter I: A Truth Universally Acknowledged',
    '<p class="lead">It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p><p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p><p>"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"</p><p>Mr. Bennet replied that he had not.</p><p>"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."</p><p>Mr. Bennet made no answer.</p><p>"Do you not want to know who has taken it?" cried his wife impatiently.</p><p>"<em>You</em> want to tell me, and I have no objection to hearing it."</p>',
    490
),
(
    v_book5_id,
    2,
    'Chapter II: The Netherfield Ball Preparations (Members Only)',
    '<p>Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.</p><p>The rest of the evening was spent in conjecturing how soon he would return Mr. Bennet''s visit, and determining when they should ask him to dinner.</p>',
    530
) ON CONFLICT (book_id, number) DO NOTHING;


-- 6. Sample Booktok Video Entries
INSERT INTO public.videos (
    title, slug, description, stream_uid, book_id, author_name, episode_number, status, view_count
) VALUES
(
    'Why African Mythology Should Be Your Next Reading Hyperfixation',
    'why-african-mythology-hyperfixation',
    'Take 60 seconds to discover why the trickster tales and cosmic gods of the Bantu tradition rival Greek and Norse mythology in depth and humor.',
    'mock_stream_uid_bantu_mythology_01',
    v_book2_id,
    'Alice Werner',
    1,
    'published',
    1420
),
(
    '3 Quotes from W.E.B. Du Bois That Will Shake You',
    'three-quotes-web-du-bois',
    'The concept of double consciousness explained with modern parallels. Why The Souls of Black Folk is more urgent today than ever.',
    'mock_stream_uid_du_bois_souls_02',
    v_book1_id,
    'W.E.B. Du Bois',
    2,
    'published',
    2890
),
(
    'Smooth Scroll vs Page Flip: What Kind of Reader Are You?',
    'smooth-scroll-vs-page-flip',
    'Testing SuperBooks dual reading mode on mobile. Hear the tactile page rustle sound and see the smooth font customizer.',
    'mock_stream_uid_superbooks_reader_03',
    NULL,
    'SuperBooks Studio',
    3,
    'published',
    3910
) ON CONFLICT (slug) DO NOTHING;

END $$;
