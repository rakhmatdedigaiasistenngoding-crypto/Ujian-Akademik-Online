const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../Dokumen_Pendukung/Bank Soal PBO');
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).sort();

let sql = `-- Seed Data for PBO Exams with Packages (Variants)\n\n`;
sql += `DO $$\nDECLARE\n  v_exam_kuis TEXT := gen_random_uuid()::TEXT;\n  v_exam_uts TEXT := gen_random_uuid()::TEXT;\n  v_exam_uas TEXT := gen_random_uuid()::TEXT;\nBEGIN\n`;
sql += `  -- Bersihkan SEMUA ujian dan soal lama\n`;
sql += `  DELETE FROM public.exam_configs;\n`;
sql += `  DELETE FROM public.questions;\n\n`;

sql += `  -- Buat 3 Exam Config baru\n`;
sql += `  INSERT INTO public.exam_configs (id, title, duration, total_questions, distribution, score_release, max_retakes, available_from, available_until)\n`;
sql += `  VALUES \n`;
sql += `    (v_exam_kuis, 'Kuis PBO', 10, 9, '{"easy": 3, "medium": 3, "hard": 3}'::jsonb, 'immediate', 5, NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days'),\n`;
sql += `    (v_exam_uts, 'UTS PBO', 10, 35, '{"easy": 11, "medium": 12, "hard": 12}'::jsonb, 'immediate', 5, NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days'),\n`;
sql += `    (v_exam_uas, 'UAS PBO', 10, 45, '{"easy": 15, "medium": 15, "hard": 15}'::jsonb, 'immediate', 5, NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days');\n\n`;

let totalInserted = 0;
const counts = { easy: 0, medium: 0, hard: 0 };

for (const file of files) {
  const content = fs.readFileSync(path.join(dirPath, file), 'utf8');

  const headingRegex = /^##\s+\*?\*?Level\s+(Mudah|Sedang|Sulit)\b.*$/gim;
  let headingMatch;
  const headings = [];

  while ((headingMatch = headingRegex.exec(content)) !== null) {
    headings.push({ index: headingMatch.index, level: headingMatch[1].toLowerCase() });
  }

  const sections = [];
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
    sections.push({ level: headings[i].level, text: content.slice(start, end) });
  }

  for (const section of sections) {
    let level, weight;
    if (section.level === 'mudah') { level = 'easy'; weight = 1; }
    else if (section.level === 'sedang') { level = 'medium'; weight = 2; }
    else if (section.level === 'sulit') { level = 'hard'; weight = 3; }
    else continue;

    const blocks = section.text.match(/\d+\.\s*\*\*[\s\S]*?(?=(?:\n\d+\.\s*\*\*|$))/g);
    if (!blocks) continue;

    for (const block of blocks) {
      const qMatch = block.match(/^\d+\.\s*\*\*(.*?)\*\*/s);
      if (!qMatch) continue;

      let text = qMatch[1].trim().replace(/'/g, "''");

      const options = [];
      const optRegex = /\*\s*[A-E]\.\s*(.*?)(?=\n\s*\*|\n\s*\*\*Kunci|$)/gs;
      let optMatch;
      while ((optMatch = optRegex.exec(block)) !== null) {
        const optText = optMatch[1].trim().replace(/'/g, "''");
        if (optText.length > 0) options.push(optText);
      }

      const keyMatch = block.match(/\*\*Kunci:\s*([A-E])\*\*/i);
      if (!keyMatch || options.length < 2) continue;

      const keyLetter = keyMatch[1].toUpperCase();
      const keyIndex = keyLetter.charCodeAt(0) - 65;

      if (keyIndex >= options.length) continue;

      const optionsJson = JSON.stringify(options).replace(/'/g, "''");

      // Insert soal HANYA 1 KALI tanpa exam_id (karena exam_id sudah dihapus dari tabel)
      sql += `  INSERT INTO public.questions (id, text, options, correct_answer, level, weight, topic)\n`;
      sql += `  VALUES (gen_random_uuid(), '${text}', '${optionsJson}'::jsonb, ${keyIndex}, '${level}', ${weight}, 'PBO');\n\n`;

      counts[level]++;
      totalInserted++;
    }
  }
}

sql += `  -- Generate Paket Kombinasi menggunakan RPC yang dibuat di migrasi 12\n`;
sql += `  -- Generate 50 paket (versi 1) untuk masing-masing ujian\n`;
sql += `  PERFORM public.generate_exam_packages(v_exam_kuis, 50, 1);\n`;
sql += `  PERFORM public.generate_exam_packages(v_exam_uts, 50, 1);\n`;
sql += `  PERFORM public.generate_exam_packages(v_exam_uas, 50, 1);\n`;

sql += `END $$;\n`;

fs.writeFileSync(path.join(__dirname, '../supabase/migrations/13_seed_packages.sql'), sql);

console.log('==================================================');
console.log('SQL Generated successfully: supabase/migrations/13_seed_packages.sql');
console.log('--------------------------------------------------');
console.log(`Bank Soal Terpusat (Independen):`);
console.log(`  Easy   : ${counts.easy}`);
console.log(`  Medium : ${counts.medium}`);
console.log(`  Hard   : ${counts.hard}`);
console.log(`  TOTAL  : ${totalInserted} soal`);
console.log(`Membuat masing-masing 50 Paket Kombinasi otomatis untuk 3 Ujian...`);
console.log('==================================================');
