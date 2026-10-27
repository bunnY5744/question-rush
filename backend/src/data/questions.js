// 60 original, verified questions. correctIndex is SERVER-ONLY and is never
// serialised by the public question / quiz-session serializers.
const raw = [
  // ---- Math (12) ----
  ['math','easy','What is 15% of 200?',['25','30','35','20'],1,'15% of 200 = 0.15 x 200 = 30.'],
  ['math','easy','What is the square root of 144?',['14','12','16','11'],1,'12 x 12 = 144.'],
  ['math','easy','What is 7 x 8 + 5?',['56','61','63','58'],1,'7 x 8 = 56, and 56 + 5 = 61.'],
  ['math','easy','If x + 9 = 17, what is x?',['6','7','8','9'],2,'x = 17 - 9 = 8.'],
  ['math','medium','What is 3 cubed (3^3)?',['9','18','27','81'],2,'3^3 = 3 x 3 x 3 = 27.'],
  ['math','medium','What is the next prime number after 13?',['14','15','17','19'],2,'14, 15 and 16 are composite; 17 is prime.'],
  ['math','easy','What is 120 divided by 8?',['12','14','15','16'],2,'8 x 15 = 120.'],
  ['math','easy','What is the area of a square with side 9 cm?',['72 cm2','81 cm2','90 cm2','18 cm2'],1,'Area = 9 x 9 = 81 cm2.'],
  ['math','medium','What is 0.5 x 0.4?',['0.2','0.02','2','0.8'],0,'0.5 x 0.4 = 0.20.'],
  ['math','medium','What is the mean of 4, 6 and 10 (to 2 decimal places)?',['6','6.67','7','5'],1,'(4 + 6 + 10) / 3 = 20 / 3 = 6.67.'],
  ['math','easy','45 + ? = 90. What is the missing number?',['35','40','45','50'],2,'90 - 45 = 45.'],
  ['math','medium','What is the perimeter of a rectangle 5 cm long and 3 cm wide?',['15 cm','16 cm','8 cm','30 cm'],1,'Perimeter = 2 x (5 + 3) = 16 cm.'],
  // ---- Number sequences (12) ----
  ['sequences','easy','2, 4, 8, 16, ... What comes next?',['20','24','32','64'],2,'Each term doubles: 16 x 2 = 32.'],
  ['sequences','easy','5, 10, 15, 20, ... What comes next?',['22','25','30','21'],1,'Add 5 each time: 20 + 5 = 25.'],
  ['sequences','medium','1, 1, 2, 3, 5, 8, ... What comes next?',['10','11','13','15'],2,'Fibonacci: 5 + 8 = 13.'],
  ['sequences','easy','100, 90, 80, 70, ... What comes next?',['65','60','50','55'],1,'Subtract 10 each time: 70 - 10 = 60.'],
  ['sequences','easy','3, 6, 12, 24, ... What comes next?',['36','42','48','30'],2,'Each term doubles: 24 x 2 = 48.'],
  ['sequences','medium','1, 4, 9, 16, ... What comes next?',['20','25','36','18'],1,'Square numbers: 5^2 = 25.'],
  ['sequences','medium','2, 3, 5, 7, 11, ... What comes next?',['12','13','15','17'],1,'Prime numbers in order; the next prime after 11 is 13.'],
  ['sequences','medium','81, 27, 9, 3, ... What comes next?',['1','2','0','6'],0,'Divide by 3 each time: 3 / 3 = 1.'],
  ['sequences','easy','7, 14, 21, 28, ... What comes next?',['32','35','42','30'],1,'Multiples of 7: 28 + 7 = 35.'],
  ['sequences','hard','1, 2, 4, 7, 11, ... What comes next?',['13','14','16','18'],2,'Differences grow by 1: +1, +2, +3, +4, then +5, so 11 + 5 = 16.'],
  ['sequences','easy','9, 18, 27, 36, ... What comes next?',['40','45','54','42'],1,'Multiples of 9: 36 + 9 = 45.'],
  ['sequences','hard','2, 6, 12, 20, 30, ... What comes next?',['36','40','42','44'],2,'Terms are n(n+1): 2, 6, 12, 20, 30, so next is 6 x 7 = 42.'],
  // ---- Logical reasoning (12) ----
  ['logic','medium','All cats are animals. Fluffy is a cat. Therefore Fluffy is...',['Not an animal','An animal','A dog','Cannot say anything at all'],1,'A cat is an animal, so Fluffy is an animal.'],
  ['logic','hard','"If it rains, the ground gets wet. The ground is wet." Can we conclude it rained?',['Yes, definitely','No - the ground could be wet for another reason','Yes, always','Only in winter'],1,'Wet ground has other possible causes; the conclusion does not follow.'],
  ['logic','easy','Which is the odd one out?',['Apple','Banana','Carrot','Mango'],2,'Carrot is a vegetable; the others are fruits.'],
  ['logic','easy','Book is to reading as fork is to...',['Kitchen','Eating','Spoon','Metal'],1,'A book is used for reading; a fork is used for eating.'],
  ['logic','medium','If A is taller than B, and B is taller than C, then A is...',['Shorter than C','Taller than C','The same height as C','Cannot be compared with C'],1,'Height comparisons are transitive: A > B > C, so A > C.'],
  ['logic','medium','Which is heavier: 1 kg of iron or 1 kg of cotton?',['Iron','Cotton','They weigh the same','It depends on the day'],2,'Both weigh exactly 1 kg.'],
  ['logic','medium',"Mary's father has five daughters: Nana, Nene, Nini, Nono. What is the fifth daughter's name?",['Nunu','Mary','Nana','There is no fifth daughter'],1,"The fifth daughter is Mary herself - it is Mary's father."],
  ['logic','easy','If today is Wednesday, what day is the day after tomorrow?',['Thursday','Friday','Saturday','Tuesday'],1,'Tomorrow is Thursday, so the day after tomorrow is Friday.'],
  ['logic','hard','3 cats catch 3 mice in 3 minutes. How long do 100 cats take to catch 100 mice?',['100 minutes','3 minutes','1 minute','30 minutes'],1,'Each cat catches one mouse in 3 minutes, and they work in parallel, so 3 minutes.'],
  ['logic','medium','How many months have 28 days?',['1 - only February','2','All 12 months','None'],2,'Every month has at least 28 days.'],
  ['logic','medium','You have 3 apples and you take away 2. How many apples do you have?',['1','2','3','0'],1,'You took 2, so you have those 2 apples.'],
  ['logic','hard','All roses are flowers. Some flowers fade quickly. Therefore...',['All roses fade quickly','Some roses may fade quickly, but it is not certain','No roses fade quickly','Roses are not flowers'],1,'Only some flowers fade, so we cannot be certain about roses specifically.'],
  // ---- Pattern recognition (12) ----
  ['patterns','hard','2, 3, 5, 9, 17, ... What comes next?',['25','33','31','19'],1,'Differences double: +1, +2, +4, +8, then +16, so 17 + 16 = 33.'],
  ['patterns','hard','A, C, F, J, O, ... What letter comes next?',['T','U','S','P'],1,'Positions 1, 3, 6, 10, 15 add 2, 3, 4, 5, so next adds 6: position 21 = U.'],
  ['patterns','easy','Z, Y, X, W, ... What letter comes next?',['U','V','T','A'],1,'The alphabet in reverse order: after W comes V.'],
  ['patterns','medium','1Z, 2Y, 3X, ... What comes next?',['4W','W4','4V','5W'],0,'Numbers rise by 1 and letters fall by 1: 4W.'],
  ['patterns','easy','Which number is the odd one out: 2, 4, 6, 9, 10?',['2','4','9','10'],2,'9 is the only odd number in the list.'],
  ['patterns','medium','AZ, BY, CX, ... What comes next?',['DW','DV','WD','DZ'],0,'First letters move forward A, B, C, D and last letters move backward Z, Y, X, W: DW.'],
  ['patterns','medium','121, 144, 169, 196, ... What comes next?',['216','225','256','200'],1,'These are 11^2, 12^2, 13^2, 14^2, so next is 15^2 = 225.'],
  ['patterns','easy','Red, Blue, Red, Blue, Red, ... What comes next?',['Red','Blue','Green','Yellow'],1,'The two colours alternate, so after Red comes Blue.'],
  ['patterns','hard','Which number does NOT belong: 8, 27, 64, 100, 125?',['8','27','100','125'],2,'8, 27, 64 and 125 are perfect cubes; 100 is not.'],
  ['patterns','medium','2:00, 2:20, 2:40, ... What time comes next?',['2:50','3:00','3:20','2:60'],1,'Add 20 minutes each time: 2:40 + 20 minutes = 3:00.'],
  ['patterns','hard','5, 6, 11, 17, 28, ... What comes next?',['39','45','44','36'],1,'Each term is the sum of the previous two: 17 + 28 = 45.'],
  ['patterns','easy','A, E, I, ... What vowel comes next?',['O','U','E','Y'],0,'The vowels in order are A, E, I, O, U.'],
  // ---- Arithmetic puzzles (12) ----
  ['arithmetic','medium','What is 9 + 9 x 2?',['36','27','18','81'],1,'Multiplication first: 9 x 2 = 18, then 9 + 18 = 27.'],
  ['arithmetic','easy','What is (8 + 2) x 3?',['26','30','16','50'],1,'Brackets first: 10 x 3 = 30.'],
  ['arithmetic','easy','What is 100 - 37?',['63','67','73','57'],0,'100 - 37 = 63.'],
  ['arithmetic','medium','Half of 84, plus 7, equals...',['42','49','35','91'],1,'Half of 84 is 42, and 42 + 7 = 49.'],
  ['arithmetic','medium','Double 17, then add 6. What is the result?',['40','34','46','23'],0,'Double 17 is 34, and 34 + 6 = 40.'],
  ['arithmetic','medium','What is 12 x 12 - 44?',['100','88','144','96'],0,'12 x 12 = 144, and 144 - 44 = 100.'],
  ['arithmetic','easy','4 pens cost 20 rupees in total. How much do 7 pens cost at the same price?',['28 rupees','35 rupees','30 rupees','40 rupees'],1,'One pen costs 5 rupees, so 7 pens cost 35 rupees.'],
  ['arithmetic','easy','Tom is 10 years old. How old will he be in 5 years?',['15','14','20','5'],0,'10 + 5 = 15.'],
  ['arithmetic','medium','What is 25 x 4 - 1?',['99','100','101','95'],0,'25 x 4 = 100, and 100 - 1 = 99.'],
  ['arithmetic','easy','? + 15 = 42. What is the missing number?',['27','37','57','17'],0,'42 - 15 = 27.'],
  ['arithmetic','medium','What is 72 divided by 9, then multiplied by 2?',['16','8','18','14'],0,'72 / 9 = 8, and 8 x 2 = 16.'],
  ['arithmetic','easy','What is the smallest two-digit even number?',['11','10','12','20'],1,'The smallest two-digit number is 10, and it is even.'],
];

const questions = raw.map((r, i) => ({
  id: `q${i + 1}`,
  category: r[0],
  difficulty: r[1],
  question: r[2],
  options: r[3].map((text, j) => ({ id: `q${i + 1}-o${j}`, text })),
  correctOptionId: `q${i + 1}-o${r[4]}`,
  explanation: r[5],
}));

function publicQuestion(q) {
  return { id: q.id, category: q.category, difficulty: q.difficulty, question: q.question, options: q.options.map(o => ({ id: o.id, text: o.text })) };
}

module.exports = { questions, publicQuestion };
