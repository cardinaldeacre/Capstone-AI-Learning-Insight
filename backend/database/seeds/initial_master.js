const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

exports.seed = async function (knex) {
	console.log('🧹 Cleaning tables...');
	await knex('learning_insight').del();
	await knex('class_submission').del();
	await knex('quiz_attempts').del();
	await knex('quiz_options').del();
	await knex('quiz_questions').del();
	await knex('quizzes').del();
	await knex('class_assignment').del();
	await knex('modules_progress').del();
	await knex('modules').del();
	await knex('class_enrolment').del();
	await knex('classes').del();
	await knex('users').del();
	console.log('✅ Database cleaned.');

	// -----------------------------------------------------------
	// 1. SETUP USERS (1 teacher, 2 Student)
	// -----------------------------------------------------------
	const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash('bismillah', salt);

	const [teacher] = await knex('users').insert({
		name: 'Oddy Virgantara',
		email: 'oddy@asta.com',
		password: password,
		role: 'teacher'
	}).returning('id');

	const [student1] = await knex('users').insert({
		name: 'Iqbal Maulana',
		email: 'maul@asta.com',
		password: password,
		role: 'student'
	}).returning('id');

	const [student2] = await knex('users').insert({
		name: 'Edward Rufus',
		email: 'edward@asta.com',
		password: password,
		role: 'student'
	}).returning('id');

	console.log('👤 Users created (1 Teacher, 2 Students).');

	// -----------------------------------------------------------
	// 2. SETUP CLASSES
	// -----------------------------------------------------------
	const [reactClass] = await knex('classes').insert({
		teacher_id: teacher.id,
		title: 'Mastering React.js Frontend',
		description: 'Pelajari React dari dasar hingga mahir, termasuk Hooks, Context, dan Redux.',
	}).returning('id');

	const [backendClass] = await knex('classes').insert({
		teacher_id: teacher.id,
		title: 'Backend API with Express & Knex',
		description: 'Membangun REST API yang scalable menggunakan Node.js, Express, dan PostgreSQL.',
	}).returning('id');

	// -----------------------------------------------------------
	// 3. ENROLMENTS (Iqbal ikut 2 kelas, Ratna cuma React)
	// -----------------------------------------------------------
	await knex('class_enrolment').insert([
		{ class_id: reactClass.id, student_id: student1.id },
		{ class_id: backendClass.id, student_id: student1.id },
		{ class_id: reactClass.id, student_id: student2.id },
	]);

	console.log('🎓 Classes & Enrolments created.');

	// -----------------------------------------------------------
	// 4. MODULES, QUIZZES, & ASSIGNMENTS (Untuk Kelas React)
	// -----------------------------------------------------------

	// --- Modul 1: Materi Bacaan ---
	const [modul1] = await knex('modules').insert({
		class_id: reactClass.id,
		title: 'Pengenalan React & JSX',
		content: `<p>${faker.lorem.paragraphs(5)}</p>`,
		order_number: 1
	}).returning('id');

	// --- Modul 2: Ada Tugasnya ---
	const [modul2] = await knex('modules').insert({
		class_id: reactClass.id,
		title: 'React Components & Props',
		content: `
            <h3>Apa itu Komponen?</h3>
            <p>${faker.lorem.paragraph()}</p>
            
            <h3>Kenapa pakai Props?</h3>
            <p>${faker.lorem.paragraph()}</p>
            
            <ul>
                <li>${faker.lorem.sentence()}</li>
                <li>${faker.lorem.sentence()}</li>
                <li>${faker.lorem.sentence()}</li>
            </ul>
        `,
		order_number: 2
	}).returning('id');

	const [assignment1] = await knex('class_assignment').insert({
		class_id: reactClass.id,
		title: 'Tugas Membuat Komponen Card',
		content: 'Buatlah komponen Card yang menerima props title dan image.',
		min_score: 55
	}).returning('id');

	// --- Modul 3: Ada Quiznya ---
	const [modul3] = await knex('modules').insert({
		class_id: reactClass.id,
		title: 'State & Lifecycle',
		content: `
            <h3>State digunakan untuk apa?</h3>
            <p>${faker.lorem.paragraph()}</p>
            
            <h3>Kenapa pakai State?</h3>
            <p>${faker.lorem.paragraph()}</p>
            
            <ul>
                <li>${faker.lorem.sentence()}</li>
                <li>${faker.lorem.sentence()}</li>
                <li>${faker.lorem.sentence()}</li>
            </ul>
        `,
		order_number: 3
	}).returning('id');

	// Buat Pertanyaan & Opsi Jawaban
	const insertQuizWithQuestions = async (moduleId, quizTitle, questionsData) => {
		// 1. Buat Quiz
		const [quiz] = await knex('quizzes').insert({
			module_id: moduleId,
			title: quizTitle,
			timer: 15, // menit
			min_score: 70
		}).returning('id');

		// 2. Loop setiap pertanyaan
		for (const q of questionsData) {
			const [questionRec] = await knex('quiz_questions').insert({
				quiz_id: quiz.id,
				question_text: q.question
			}).returning('id');

			// 3. Siapkan opsi jawaban dengan format DB
			const optionsToInsert = q.options.map(opt => ({
				question_id: questionRec.id,
				option_text: opt.text,
				is_correct: opt.isCorrect
			}));

			// 4. Insert opsi
			await knex('quiz_options').insert(optionsToInsert);
		}
	};

	const questionsReactIntro = [
		{
			question: 'Apa itu JSX dalam ekosistem React?',
			options: [
				{ text: 'Syntax extension untuk JavaScript yang mirip HTML', isCorrect: true },
				{ text: 'Jenis database baru buatan Facebook', isCorrect: false },
				{ text: 'Framework CSS untuk styling komponen', isCorrect: false },
				{ text: 'Fungsi untuk menjalankan server Node.js', isCorrect: false },
			]
		},
		{
			question: 'Bagaimana cara menulis atribut class CSS di dalam JSX?',
			options: [
				{ text: 'className', isCorrect: true },
				{ text: 'class', isCorrect: false },
				{ text: 'styleClass', isCorrect: false },
				{ text: 'cssClass', isCorrect: false },
			]
		},
		{
			question: 'Tag kosong <></> atau <Fragment> digunakan untuk?',
			options: [
				{ text: 'Membungkus elemen tanpa menambah node DOM ekstra', isCorrect: true },
				{ text: 'Membuat komentar di dalam kode', isCorrect: false },
				{ text: 'Menghapus elemen dari layar', isCorrect: false },
				{ text: 'Membuat variabel global', isCorrect: false },
			]
		},
		{
			question: 'Manakah cara yang benar untuk menyisipkan variabel JS ke dalam JSX?',
			options: [
				{ text: 'Menggunakan kurung kurawal {}', isCorrect: true },
				{ text: 'Menggunakan tanda dolar $()', isCorrect: false },
				{ text: 'Menggunakan tanda kutip ganda ""', isCorrect: false },
				{ text: 'Menggunakan kurung siku []', isCorrect: false },
			]
		},
		{
			question: 'Syarat utama sebuah React Component adalah...',
			options: [
				{ text: 'Nama function harus diawali huruf kapital', isCorrect: true },
				{ text: 'Harus memiliki file CSS sendiri', isCorrect: false },
				{ text: 'Wajib menggunakan TypeScript', isCorrect: false },
				{ text: 'Harus memiliki minimal 2 props', isCorrect: false },
			]
		}
	];

	const questionsReactState = [
		{
			question: 'Manakah hook yang wajib digunakan untuk membuat state di functional component?',
			options: [
				{ text: 'useState', isCorrect: true },
				{ text: 'useEffect', isCorrect: false },
				{ text: 'useContext', isCorrect: false },
				{ text: 'useProps', isCorrect: false },
			]
		},
		{
			question: 'Sifat utama dari State di React adalah...',
			options: [
				{ text: 'Immutable (tidak boleh diubah langsung)', isCorrect: true },
				{ text: 'Mutable (bebas diubah kapan saja)', isCorrect: false },
				{ text: 'Global (bisa diakses semua file)', isCorrect: false },
				{ text: 'Permanent (tersimpan di database)', isCorrect: false },
			]
		},
		{
			question: 'Kapan komponen React akan melakukan re-render otomatis?',
			options: [
				{ text: 'Saat State atau Props berubah', isCorrect: true },
				{ text: 'Setiap 1 detik sekali', isCorrect: false },
				{ text: 'Saat user menggerakkan mouse', isCorrect: false },
				{ text: 'Hanya saat halaman di-refresh', isCorrect: false },
			]
		},
		{
			question: 'Apa nilai awal (initial value) dari kode: const [count, setCount] = useState(10)?',
			options: [
				{ text: 'Angka 10', isCorrect: true },
				{ text: 'Angka 0', isCorrect: false },
				{ text: 'Undefined', isCorrect: false },
				{ text: 'Null', isCorrect: false },
			]
		},
		{
			question: 'Hook useEffect paling tepat digunakan untuk menangani...',
			options: [
				{ text: 'Side effects (fetching data, subscription, manual DOM)', isCorrect: true },
				{ text: 'Validasi form login', isCorrect: false },
				{ text: 'Styling CSS conditional', isCorrect: false },
				{ text: 'Membuat routing halaman', isCorrect: false },
			]
		}
	];

	// Insert Quiz ke Modul 1
	await insertQuizWithQuestions(modul1.id, 'Kuis Basic React', questionsReactIntro);

	// Insert Quiz ke Modul 3
	await insertQuizWithQuestions(modul3.id, 'Kuis State & Hooks', questionsReactState);

	console.log('✅ Quizzes created successfully with 5 questions each!');

	console.log('🚀 Modules, Assignments, & Quizzes created.');

	// -----------------------------------------------------------
	// 5. SIMULASI AKTIVITAS SISWA (Progress, Submissions, Attempts)
	// -----------------------------------------------------------

	// A. Progress Membaca
	// Iqbal rajin, sudah baca modul 1 dan 2
	await knex('modules_progress').insert([
		{ module_id: modul1.id, student_id: student1.id, started_at: knex.fn.now(), completed_at: knex.fn.now() },
		{ module_id: modul2.id, student_id: student1.id, started_at: knex.fn.now(), completed_at: knex.fn.now() },
	]);

	// Ratna baru baca modul 1
	await knex('modules_progress').insert([
		{ module_id: modul1.id, student_id: student2.id, started_at: knex.fn.now(), completed_at: null }, // Belum selesai
	]);



	// -----------------------------------------------------------
	// 5. LEARNING INSIGHTS (AI Mock Data)
	// -----------------------------------------------------------
	await knex('learning_insight').insert([
		{
			student_id: student1.id,
			insight_text: 'Siswa Iqbal menunjukkan pemahaman yang sangat baik pada konsep dasar React. Disarankan untuk memberikan tantangan materi Redux.'
		},
		{
			student_id: student2.id,
			insight_text: 'Siswa Ratna kesulitan pada kuis State & Lifecycle. Disarankan untuk mengulang modul 3 sebelum lanjut.'
		}
	]);

	console.log('🤖 AI Insights created. Seeding finished!');
};