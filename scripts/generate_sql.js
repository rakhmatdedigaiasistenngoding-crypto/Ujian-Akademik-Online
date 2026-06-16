const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../Dokumen_Pendukung/Bank Soal PBO');
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

let sql = `-- Seed Data for PBO Exam\n\n`;
sql += `DO $$\nDECLARE\n  v_exam_id UUID;\nBEGIN\n`;
sql += `  -- Create new Exam Config\n`;
sql += `  v_exam_id := gen_random_uuid();\n`;
sql += `  INSERT INTO public.exam_configs (id, title, description, duration, total_questions, passing_score, score_release, max_retakes)\n`;
sql += `  VALUES (v_exam_id, 'Kuis Pemrograman Berorientasi Objek', 'Ujian komprehensif PBO.', 60, 45, 60, 'immediate', 2);\n\n`;

for (const file of files) {
  const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
  
  // Regex to match question blocks
  const questionRegex = /(\d+)\.\s*\*\*(.*?)\*\*\s*(?:\n|\r\n?)(?:\s*\*\s*[A-Z]\.\s*(.*?)(?:\n|\r\n?)){4,5}\s*(?:\n|\r\n?)\*\*Kunci:\s*([A-E])\*\*/gs;
  
  // We need a more robust parsing because options might be exactly 4 or 5.
  // Let's split by numbers
  const blocks = content.split(/(?=\n\d+\.\s*\*\*)/g);
  
  for (const block of blocks) {
    const qMatch = block.match(/^\d+\.\s*\*\*(.*?)\*\*/s);
    if (!qMatch) continue;
    
    let text = qMatch[1].trim().replace(/'/g, "''");
    
    // find options
    const options = [];
    const optRegex = /^\s*\*\s*([A-E])\.\s*(.*)$/gm;
    let optMatch;
    while ((optMatch = optRegex.exec(block)) !== null) {
      options.push(optMatch[2].trim().replace(/'/g, "''"));
    }
    
    const keyMatch = block.match(/\*\*Kunci:\s*([A-E])\*\*/i);
    if (!keyMatch || options.length === 0) continue;
    
    const keyLetter = keyMatch[1].toUpperCase();
    const keyIndex = keyLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3, E=4
    
    const levelMatch = file.match(/Mudah|Sedang|Sulit/i);
    let level = 'medium';
    let weight = 1;
    if (block.toLowerCase().includes('mudah') || (levelMatch && levelMatch[0].toLowerCase() === 'mudah')) { level = 'easy'; weight = 1; }
    if (block.toLowerCase().includes('sedang') || (levelMatch && levelMatch[0].toLowerCase() === 'sedang')) { level = 'medium'; weight = 2; }
    if (block.toLowerCase().includes('sulit') || (levelMatch && levelMatch[0].toLowerCase() === 'sulit')) { level = 'hard'; weight = 3; }

    const optionsJson = JSON.stringify(options).replace(/'/g, "''");
    
    sql += `  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)\n`;
    sql += `  VALUES (gen_random_uuid(), v_exam_id, '${text}', '${optionsJson}'::jsonb, ${keyIndex}, '${level}', ${weight}, 'PBO');\n\n`;
  }
}

sql += `END $$;\n`;

fs.writeFileSync(path.join(__dirname, '../supabase/migrations/09_seed_pbo.sql'), sql);
console.log('SQL Generated successfully at supabase/migrations/09_seed_pbo.sql');
