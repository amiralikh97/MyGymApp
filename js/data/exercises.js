// ---------------------------------------------------------------------------
// Exercise library
// ---------------------------------------------------------------------------
// Each entry is written so a beginner can read it and perform the lift safely
// without any outside help.
//
//   desc      what the exercise is and what it builds, in plain language
//   setup     how to set the bench/machine/weights before you start
//   steps     the movement itself, in order
//   tips      cues that make it work better
//   safety    precautions - read these before loading up
//   mistakes  what people get wrong
//
//   paired    two implements at once, one per hand -> per-side weights offered
//   uni       one limb at a time
//   bw        bodyweight; a logged weight means ADDED weight
// ---------------------------------------------------------------------------

export const MUSCLES = [
  'Chest', 'Upper Back', 'Lats', 'Traps', 'Lower Back', 'Shoulders', 'Rear Delts',
  'Biceps', 'Triceps', 'Forearms', 'Quads', 'Hamstrings', 'Glutes', 'Adductors',
  'Abductors', 'Calves', 'Abs', 'Obliques', 'Neck', 'Full Body', 'Cardio'
];

export const EQUIPMENT = [
  'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Smith Machine', 'Bodyweight',
  'Kettlebell', 'Band', 'EZ Bar', 'Trap Bar', 'Plate', 'Sled', 'Cardio Machine', 'Other'
];

export const CATEGORIES = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'];

export const EXERCISES = [

/* ========================== CHEST ========================== */
{
  id: 'barbell-bench-press', name: 'Barbell Bench Press', cat: 'Chest', eq: 'Barbell',
  prim: ['Chest'], sec: ['Triceps', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'You lie on a flat bench and push a barbell away from your chest. It is the main exercise for building the chest, and it also works the triceps (back of the arm) and the front of the shoulders. You can load it heavier than any other chest exercise.',
  setup: [
    'Set the bar in the rack at a height you can reach with almost-straight arms while lying down.',
    'Load the plates evenly on both sides and put the clips on.',
    'Set the safety bars just below your chest height if the rack has them.'
  ],
  steps: [
    'Lie on the bench so your eyes are directly under the bar.',
    'Put both feet flat on the floor and push them down - this keeps you stable.',
    'Squeeze your shoulder blades together and down, like you are pinching a pencil between them. Keep them there for the whole set.',
    'Grip the bar a bit wider than your shoulders. Wrap your thumbs around the bar.',
    'Lift the bar out of the rack and move it so it is above your shoulders.',
    'Lower it slowly to the middle of your chest (around nipple level). Your elbows should point down and slightly out, not straight out to the sides.',
    'Touch your chest lightly, then push the bar back up until your arms are straight.'
  ],
  tips: [
    'Breathe in on the way down, breathe out as you push up.',
    'Keep your wrists straight - the bar sits on the base of your palm, not in your fingers.',
    'A good starting point is the empty bar. Add weight only once 8-10 reps feel smooth.'
  ],
  safety: [
    'ALWAYS use safety bars or a spotter. This is the lift people get pinned under.',
    'Never use a "suicide grip" (thumbs on the same side as your fingers) - the bar can roll onto your throat.',
    'If your shoulder pinches at the bottom, stop lowering so far, or bring your grip in narrower.',
    'Do not bounce the bar off your ribs. That can bruise or crack a rib.'
  ],
  mistakes: [
    'Elbows flared straight out to the sides - this is the number one cause of shoulder pain in this lift.',
    'Lifting your hips off the bench to push more weight.',
    'Uneven grip - check the knurling marks so both hands are the same distance from the middle.'
  ]
},
{
  id: 'incline-barbell-press', name: 'Incline Barbell Press', cat: 'Chest', eq: 'Barbell',
  prim: ['Chest'], sec: ['Shoulders', 'Triceps'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'A bench press on a bench tilted upward. Tilting the bench moves the work to the upper part of your chest, near your collarbone - the area that gives the chest a full, shelf-like look.',
  setup: ['Set the bench angle to about 30 degrees (roughly the second or third notch).', 'Sit down first and check the bar is above your upper chest, not your face.'],
  steps: [
    'Sit back with your shoulder blades squeezed together and feet planted.',
    'Grip slightly wider than your shoulders and unrack the bar.',
    'Lower it slowly to just below your collarbone.',
    'Push back up and slightly toward your head, stopping just before your elbows fully lock.'
  ],
  tips: [
    'The steeper the bench, the more it becomes a shoulder exercise. 30 degrees is the sweet spot for chest.',
    'Expect to use around 20-30% less weight than on flat bench. That is normal.'
  ],
  safety: [
    'Use the rack safeties or a spotter - it is harder to bail out of an incline press than a flat one.',
    'If your front shoulder pinches, lower the bench angle or reduce your range slightly.'
  ],
  mistakes: ['Setting the bench nearly upright, which turns it into a shoulder press.', 'Lowering the bar to the middle of the chest instead of the top.']
},
{
  id: 'decline-barbell-press', name: 'Decline Barbell Press', cat: 'Chest', eq: 'Barbell',
  prim: ['Chest'], sec: ['Triceps'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'A bench press with your head lower than your hips. It works the lower part of the chest and is usually the easiest press on the shoulders, so many people can lift the most weight here.',
  setup: ['Hook your legs under the leg pads and make sure they hold you firmly before you lie back.'],
  steps: ['Lie back and take the bar from the rack (ask for help - the angle is awkward).', 'Lower the bar to your lower chest.', 'Press straight up until your arms are straight.'],
  tips: ['Have someone hand you the bar and take it back at the end.'],
  safety: [
    'Blood rushes to your head in this position. Sit up slowly afterwards or you may feel dizzy.',
    'Do not do this alone with heavy weight - you cannot safely dump the bar from a decline.',
    'Skip this exercise if you have high blood pressure or get lightheaded easily.'
  ],
  mistakes: ['Sitting up too quickly after the set.', 'Letting your legs come loose from the pads mid-set.']
},
{
  id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', cat: 'Chest', eq: 'Dumbbell', paired: true,
  prim: ['Chest'], sec: ['Triceps', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'The same movement as a bench press but holding a dumbbell in each hand. Because each arm works on its own, you get a longer stretch at the bottom and your weaker side cannot hide behind your stronger side. A great first chest exercise.',
  setup: ['Pick a pair of dumbbells you can press for 10 reps with 2 in reserve.', 'Sit on the end of a flat bench with a dumbbell standing on each thigh.'],
  steps: [
    'Sit on the bench with the dumbbells resting on your thighs, palms facing in.',
    'Use your knees to kick one dumbbell up as you lie back, then the other. Roll back smoothly.',
    'End up lying flat with the dumbbells at chest level, palms facing your feet.',
    'Squeeze your shoulder blades together and set your feet.',
    'Press both dumbbells straight up until your arms are almost straight and the dumbbells are above your shoulders.',
    'Lower them slowly and wide enough that you feel a stretch across your chest.'
  ],
  tips: [
    'To get up safely at the end: bring the dumbbells to your chest, tuck your chin, and use the weight to rock yourself up to sitting.',
    'Do not clang the dumbbells together at the top - stop just short and keep the tension on your chest.'
  ],
  safety: [
    'Never just drop the dumbbells straight down beside you from a lying position - it can wrench your shoulder. Bring them to your chest first.',
    'Go lighter than you would on a barbell. The dumbbells wobble and your stabiliser muscles need time to catch up.',
    'If you are training alone and fail a rep, guide the dumbbells down to the floor at your sides - do not fight it.'
  ],
  mistakes: ['Letting the elbows sink far below the bench with heavy weight.', 'Dropping the dumbbells with no control at the end of the set.']
},
{
  id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', cat: 'Chest', eq: 'Dumbbell', paired: true,
  prim: ['Chest'], sec: ['Shoulders', 'Triceps'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'Dumbbell pressing on a tilted bench. Builds the upper chest with a deeper stretch than the barbell version, and it is gentler on the shoulders because your hands can move naturally.',
  setup: ['Set the bench to about 30 degrees.', 'Rest the dumbbells on your thighs before you lean back.'],
  steps: ['Kick the dumbbells up one at a time as you lean back.', 'Start with them at the sides of your upper chest, elbows slightly tucked.', 'Press up and slightly inward.', 'Lower slowly until you feel the stretch, keeping the dumbbells above your elbows.'],
  tips: ['Imagine your elbows are always directly under the weights - that keeps the load on the chest, not the wrists.'],
  safety: ['Kicking the dumbbells up is the risky part. If they feel too heavy to kick up cleanly, they are too heavy to press.'],
  mistakes: ['Pressing the dumbbells toward your face rather than over your upper chest.']
},
{
  id: 'flat-dumbbell-fly', name: 'Dumbbell Fly', cat: 'Chest', eq: 'Dumbbell', paired: true,
  prim: ['Chest'], sec: ['Shoulders'], mech: 'Isolation', force: 'Push', level: 'Intermediate',
  desc: 'You open your arms wide in a big arc and bring them back together, like hugging a barrel. This trains the chest in its actual job - pulling the arms across the body - and gives a strong stretch that pressing cannot.',
  setup: ['Choose light dumbbells. Most people use less than half of what they press.'],
  steps: [
    'Lie flat with a dumbbell in each hand held above your chest, palms facing each other.',
    'Bend your elbows slightly and then LOCK that angle - it must not change for the whole set.',
    'Open your arms out to the sides in a wide arc until you feel a strong stretch across your chest.',
    'Bring them back together along the same arc and squeeze your chest at the top.'
  ],
  tips: ['Think about pushing your hands apart, not down.', 'Stop the descent when your upper arms are level with the bench.'],
  safety: [
    'This is the exercise most likely to strain a shoulder or chest muscle if you go too heavy. Start very light.',
    'Never straighten your arms completely at the bottom - the strain on the shoulder joint multiplies.',
    'If you feel a sharp pull near your armpit, stop the set immediately.'
  ],
  mistakes: ['Bending and straightening the elbows, which turns it into a bad press.', 'Going so deep the shoulders roll forward.']
},
{
  id: 'incline-dumbbell-fly', name: 'Incline Dumbbell Fly', cat: 'Chest', eq: 'Dumbbell', paired: true,
  prim: ['Chest'], sec: ['Shoulders'], mech: 'Isolation', force: 'Push', level: 'Intermediate',
  desc: 'The fly done on a tilted bench so the stretch lands on the upper chest.',
  setup: ['Bench at about 30 degrees, light dumbbells.'],
  steps: ['Hold the dumbbells above your upper chest, palms facing each other, elbows slightly bent.', 'Open out in a wide arc until your upper arms are level with your torso.', 'Bring them back together and squeeze.'],
  tips: ['Slow on the way out, controlled on the way in. No swinging.'],
  safety: ['Same as the flat fly: keep the elbow bend fixed and never let your arms hyperextend behind you.'],
  mistakes: ['Using momentum to throw the weights back up.']
},
{
  id: 'cable-crossover', name: 'Cable Crossover', cat: 'Chest', eq: 'Cable', paired: true,
  prim: ['Chest'], sec: ['Shoulders'], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A standing fly using two cable machines. The cables pull on your chest evenly the whole way through, and your hands can cross over past each other for an extra squeeze. Very safe and easy to feel.',
  setup: ['Set both pulleys high and clip on a single handle each.', 'Take one handle in each hand and step forward until the weight stacks lift slightly.'],
  steps: [
    'Stand with one foot forward for balance and lean your chest forward a little.',
    'Start with your arms out wide, elbows slightly bent.',
    'Pull your hands down and together in front of your hips.',
    'Let them cross slightly, hold for a second, then let your arms open back out slowly.'
  ],
  tips: [
    'High pulleys work the lower chest, low pulleys the upper chest, shoulder-height the middle. Rotate between them.',
    'Lean forward enough that the cables do not pull you off balance.'
  ],
  safety: ['Do not let the weight stack yank your arms back at the end of a set - keep control until the handles are hooked up again.'],
  mistakes: ['Standing straight upright so the shoulders take over.', 'Bending the elbows through the rep so it becomes a pushdown.']
},
{
  id: 'pec-deck', name: 'Pec Deck (Machine Fly)', cat: 'Chest', eq: 'Machine',
  prim: ['Chest'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A seated machine that brings your arms together in front of you. The machine controls the path, so it is the safest way to take your chest close to failure. Excellent last exercise of a chest day.',
  setup: [
    'Sit down and adjust the seat height so the handles are level with the middle of your chest.',
    'If the machine has a starting-position lever, use it so you do not have to reach back for the handles.'
  ],
  steps: ['Sit with your back flat against the pad and feet on the floor.', 'Grip the handles or place your forearms on the pads.', 'Bring the handles together in front of your chest.', 'Squeeze for a full second, then let them open slowly until you feel the stretch.'],
  tips: ['Do not let the weight stack touch down between reps - keep constant tension.'],
  safety: ['Set the starting position so your arms do not go far behind your body. Too much backward stretch is where shoulders get hurt on this machine.'],
  mistakes: ['Seat too low or too high, which shifts the work onto the shoulders.', 'Letting your back arch away from the pad.']
},
{
  id: 'machine-chest-press', name: 'Machine Chest Press', cat: 'Chest', eq: 'Machine',
  prim: ['Chest'], sec: ['Triceps', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'A seated pressing machine. It moves on a fixed track so you do not have to balance anything. Perfect if you are new, training alone, or want to push hard without a spotter.',
  setup: ['Adjust the seat so the handles line up with the middle of your chest.', 'Put the pin in the weight stack at a light weight for your first set.'],
  steps: ['Sit with your back flat on the pad and shoulder blades pulled back.', 'Grip the handles and push forward until your arms are almost straight.', 'Return slowly until you feel a stretch in your chest, without banging the stack down.'],
  tips: ['Keep a small bend in the elbows at the end so the tension stays on your chest.'],
  safety: ['If the seat is too low the handles push up into your shoulder joint. Take ten seconds to set it properly.'],
  mistakes: ['Shrugging the shoulders up toward the ears as you press.']
},
{
  id: 'push-up', name: 'Push-Up', cat: 'Chest', eq: 'Bodyweight', bw: true,
  prim: ['Chest'], sec: ['Triceps', 'Shoulders', 'Abs'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'The classic. You push your own bodyweight up off the floor. Works the chest, triceps and shoulders, and your abs have to work to keep your body straight. Needs no equipment.',
  setup: ['Clear a space on the floor. A mat helps if your wrists are sensitive.'],
  steps: [
    'Place your hands slightly wider than your shoulders, level with your chest.',
    'Straighten your legs behind you and come up onto your toes.',
    'Squeeze your abs and glutes so your body is one straight line from head to heels.',
    'Bend your elbows and lower until your chest is about a fist above the floor. Elbows point back at roughly 45 degrees.',
    'Push the floor away and return to the top without letting your hips sag.'
  ],
  tips: [
    'Too hard? Put your hands on a bench or wall. Too easy? Put your feet on a bench, or lay a plate on your back.',
    'Log the added weight in this app - bodyweight exercises accept an "added" number.'
  ],
  safety: ['If your wrists hurt, use push-up handles or make fists and go on your knuckles.', 'Stop if your lower back starts to ache - that means your core has given out, not your chest.'],
  mistakes: ['Elbows flared straight out to the sides.', 'Hips sagging toward the floor or sticking up in the air.', 'Only going halfway down.']
},
{
  id: 'chest-dip', name: 'Chest Dip', cat: 'Chest', eq: 'Bodyweight', bw: true,
  prim: ['Chest'], sec: ['Triceps', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'You hold yourself up on two parallel bars and lower your body between them, leaning forward so the chest does the work. One of the hardest and most effective bodyweight chest exercises.',
  setup: ['Find parallel bars roughly shoulder width. If you cannot do a full dip yet, use an assisted dip machine or loop a band across the bars to stand on.'],
  steps: [
    'Jump or step up so your arms are straight and you are holding yourself above the bars.',
    'Cross your ankles behind you and lean your chest forward about 30 degrees.',
    'Bend your elbows and lower until your shoulders are level with your elbows.',
    'Push back up, keeping the forward lean the whole time.'
  ],
  tips: ['Leaning forward = chest. Staying upright = triceps.', 'Once you can do 12 clean reps, add weight with a dip belt and log it as added weight.'],
  safety: [
    'Do NOT go deeper than shoulders-level-with-elbows. Going too deep is a common cause of shoulder injuries.',
    'If you feel a pinch or clicking in the front of the shoulder, stop and use the assisted machine with a shorter range.',
    'Get on and off the bars in control - dropping down hard is how people tear a chest muscle.'
  ],
  mistakes: ['Sinking as deep as possible.', 'Bouncing at the bottom.']
},
{
  id: 'smith-bench-press', name: 'Smith Machine Bench Press', cat: 'Chest', eq: 'Smith Machine',
  prim: ['Chest'], sec: ['Triceps', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'A bench press where the bar runs on fixed rails. You do not have to balance it, so you can push hard on your own. A good bridge between machines and free weights.',
  setup: ['Slide a flat bench under the bar and lie down to check the bar comes down to your lower chest, not your throat.', 'Set the safety catches just below your chest.'],
  steps: ['Lie down, shoulder blades squeezed, feet flat.', 'Twist your wrists to unhook the bar.', 'Lower to your lower chest, then press up.', 'To rack it, twist the bar back onto the hooks at the top.'],
  tips: ['Practise the unhook/re-hook twist with no weight first - it catches people out.'],
  safety: ['Always set the safety stops. The whole point of a Smith machine is you can bail safely.'],
  mistakes: ['Positioning the bench so the fixed bar path lands on your neck or stomach.']
},
{
  id: 'floor-press', name: 'Floor Press', cat: 'Chest', eq: 'Barbell',
  prim: ['Chest'], sec: ['Triceps'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'A bench press done lying on the floor. The floor stops your arms halfway, which protects the shoulders and builds the top half of your press.',
  setup: ['Set the bar low in a rack, roughly at arm height when lying on the floor.'],
  steps: ['Lie on the floor with knees bent, feet flat.', 'Unrack and lower until the backs of your upper arms touch the floor.', 'Pause for one second, then press up.'],
  tips: ['The pause removes all the bounce. Keep it honest.'],
  safety: ['Good option if bench pressing bothers your shoulders, since the floor limits the depth.'],
  mistakes: ['Bouncing the elbows off the floor.']
},
{
  id: 'svend-press', name: 'Svend Press (Plate Squeeze Press)', cat: 'Chest', eq: 'Plate',
  prim: ['Chest'], sec: ['Shoulders'], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'You squeeze two light plates together in front of your chest and push them straight out. Almost no stress on the joints, and a very strong squeeze through the middle of the chest. Good finisher.',
  setup: ['Grab two light plates (2.5-5 kg each) and press them flat together between your palms.'],
  steps: ['Hold the plates against your chest, squeezing hard.', 'Push them straight out until your arms are extended, still squeezing.', 'Bring them back in slowly.'],
  tips: ['The squeeze creates the tension - not the weight on the plates.'],
  safety: ['Use clean, dry plates. Sweaty hands plus smooth plates means they will slip out.'],
  mistakes: ['Using plates so heavy you cannot keep them pressed together.']
},
{
  id: 'machine-incline-press', name: 'Incline Machine Press', cat: 'Chest', eq: 'Machine',
  prim: ['Chest'], sec: ['Shoulders', 'Triceps'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'A machine press angled upward to hit the upper chest. Same benefits as the flat machine press: no balancing, easy to push near failure.',
  setup: ['Adjust the seat so the handles are just below your collarbone.'],
  steps: ['Sit back firmly, grip the handles, press up and forward.', 'Return slowly to a stretch.'],
  tips: ['Try one set with a neutral (palms-facing) grip if the machine offers one - often easier on the shoulders.'],
  safety: ['Do not let the stack slam at the bottom; it jolts the shoulder joint.'],
  mistakes: ['Seat set so high the handles start behind your shoulders.']
}
,
/* ========================== BACK ========================== */
{
  id: 'deadlift', name: 'Conventional Deadlift', cat: 'Back', eq: 'Barbell',
  prim: ['Lower Back', 'Glutes', 'Hamstrings'], sec: ['Traps', 'Lats', 'Forearms', 'Quads'], mech: 'Compound', force: 'Hinge', level: 'Advanced',
  desc: 'You lift a loaded barbell from the floor until you are standing up straight. It trains almost the entire back of your body plus your grip. It is the heaviest lift most people ever do - and the one where technique matters most.',
  setup: [
    'Load the bar so the plates raise it to standard height (use 20 kg / 45 lb plates, or bumper plates, or stand the bar on blocks).',
    'Stand with the bar over the middle of your feet, roughly a thumb\'s width from your shins.',
    'Feet about hip width, toes pointing slightly out.'
  ],
  steps: [
    'Bend at the hips and grip the bar just outside your legs, arms straight.',
    'Bend your knees forward until your shins lightly touch the bar. Do not push the bar forward.',
    'Lift your chest, flatten your back, and pull your shoulders down. Imagine squeezing an orange in each armpit.',
    'Take a big breath into your stomach and brace like someone is about to punch you.',
    'Pull up on the bar just enough to take the slack out of it - you should hear a soft click, not a clang.',
    'Push the floor away with your legs. Keep the bar sliding up against your shins and thighs.',
    'Once the bar passes your knees, drive your hips forward and stand tall.',
    'To lower: push your hips back first, and only bend your knees once the bar is past them.'
  ],
  tips: [
    'The bar should never travel forward. If it swings away from your legs, the weight is too heavy or your setup is off.',
    'Reset your breath and brace before every single rep. Do not bounce reps off the floor.',
    'Use chalk or straps if your grip fails before your back does.'
  ],
  safety: [
    'A rounded lower back under heavy load is the main way people injure themselves here. If your back rounds, drop the weight - no exceptions.',
    'Do not lean backwards at the top. Standing tall is the finish; leaning back compresses your spine.',
    'Do not wear running shoes with soft cushioned soles. Flat shoes or bare feet are far more stable.',
    'Spend weeks practising with light weight before going heavy. This is not a lift to rush.',
    'Do not hold your breath for multiple reps in a row - breathe out at the top, re-brace at the bottom.'
  ],
  mistakes: [
    'Hips shooting up first so your legs straighten before the bar moves.',
    'Jerking the bar off the floor instead of building tension first.',
    'Starting with the bar too far from your shins.'
  ]
},
{
  id: 'sumo-deadlift', name: 'Sumo Deadlift', cat: 'Back', eq: 'Barbell',
  prim: ['Glutes', 'Quads', 'Hamstrings'], sec: ['Lower Back', 'Traps', 'Adductors'], mech: 'Compound', force: 'Hinge', level: 'Advanced',
  desc: 'A deadlift with a very wide stance and your hands gripping inside your knees. Your torso stays more upright, so it puts less strain on the lower back and more work on the hips, thighs and inner thighs. Often a better fit for taller or long-legged lifters.',
  setup: ['Take a wide stance so your shins are close to the plates. Turn your toes out 30-45 degrees.'],
  steps: ['Reach down and grip the bar with your hands inside your legs, arms hanging straight.', 'Drop your hips, push your knees out over your toes, and lift your chest.', 'Take the slack out of the bar, then push your feet apart into the floor as you stand.', 'Lock out by squeezing your glutes. Lower by pushing your hips back.'],
  tips: ['The cue is "spread the floor apart", not "squat it up".', 'If you feel stuck at the floor, get your hips a little lower and closer to the bar.'],
  safety: [
    'The wide stance stretches your inner thighs (adductors) hard. Warm them up first or you can strain one.',
    'Keep your knees pushed out. If they cave inward under load, the weight is too heavy.',
    'Same rule as conventional: back rounds, weight comes off.'
  ],
  mistakes: ['Letting the knees collapse inward.', 'Turning it into a squat with a bar in your hands.']
},
{
  id: 'trap-bar-deadlift', name: 'Trap Bar Deadlift', cat: 'Back', eq: 'Trap Bar',
  prim: ['Quads', 'Glutes'], sec: ['Lower Back', 'Traps', 'Hamstrings', 'Forearms'], mech: 'Compound', force: 'Hinge', level: 'Beginner',
  desc: 'A deadlift using a hexagon-shaped bar you stand inside of. Because the weight is beside you instead of in front, it is much easier on the lower back and far easier to learn. The best deadlift variation for a beginner.',
  setup: ['Step into the middle of the hex bar with feet hip width. Use the high handles if the bar has both.'],
  steps: ['Bend down and grip the handles at your sides.', 'Drop your hips, chest up, back flat, arms straight.', 'Push through your whole foot and stand up tall.', 'Lower under control by pushing your hips back and bending the knees.'],
  tips: ['This feels like a mix of a squat and a deadlift, and that is fine.', 'Start with the high handles - they shorten the range and make it easier to keep a flat back.'],
  safety: ['Still keep the back flat. The hex bar is more forgiving, not injury-proof.', 'Watch your shins on the bar frame when you stand up.'],
  mistakes: ['Standing too far forward or back inside the frame.']
},
{
  id: 'barbell-row', name: 'Barbell Bent-Over Row', cat: 'Back', eq: 'Barbell',
  prim: ['Upper Back', 'Lats'], sec: ['Biceps', 'Rear Delts', 'Lower Back'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'You bend forward at the hips and pull a barbell into your stomach. This is the main exercise for building thickness across the middle of your back. Your lower back works hard just holding the position.',
  setup: ['Load the bar and stand over it with feet hip width.', 'Deadlift it up to standing first, then hinge into position.'],
  steps: [
    'Hold the bar slightly wider than shoulder width, palms facing you.',
    'Push your hips back and bend forward until your upper body is somewhere between 15 and 45 degrees above horizontal. Keep a soft bend in the knees.',
    'Let the bar hang with your arms straight and your shoulder blades reaching forward.',
    'Pull the bar into your lower ribs / upper stomach, driving your elbows back behind you.',
    'Squeeze your shoulder blades together, then lower the bar until your arms are fully straight again.'
  ],
  tips: [
    'Your upper body angle must stay the same all set. If you stand up as you pull, the weight is too heavy.',
    'Palms-up (underhand) grip shifts more work onto the lats and biceps.'
  ],
  safety: [
    'This position is demanding on the lower back. Do it after your main lift, not when already exhausted.',
    'If your lower back rounds, use a chest-supported row or a cable row instead - you lose nothing.',
    'Do not do heavy bent-over rows if you have any current lower-back pain.'
  ],
  mistakes: ['Standing up with every rep to help the bar move.', 'Pulling the bar to the chest, which turns it into a rear-delt exercise.']
},
{
  id: 'pendlay-row', name: 'Pendlay Row', cat: 'Back', eq: 'Barbell',
  prim: ['Upper Back', 'Lats'], sec: ['Biceps', 'Rear Delts'], mech: 'Compound', force: 'Pull', level: 'Advanced',
  desc: 'A strict barbell row where the bar returns to the floor between every rep and your back stays parallel to the ground. Every rep starts from a dead stop, so there is no cheating at all.',
  setup: ['Bar on the floor, torso bent to horizontal.'],
  steps: ['Set your back flat and parallel to the floor.', 'Pull the bar explosively to your lower chest.', 'Lower it all the way back to the floor and let it settle.', 'Re-brace and repeat.'],
  tips: ['Full stop on the floor each rep - no touch and go.'],
  safety: ['Holding a flat back parallel to the floor is hard. Master the regular bent-over row first.'],
  mistakes: ['Letting the torso rise above parallel.']
},
{
  id: 'pull-up', name: 'Pull-Up', cat: 'Back', eq: 'Bodyweight', bw: true,
  prim: ['Lats'], sec: ['Biceps', 'Upper Back', 'Forearms'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'You hang from a bar with palms facing away and pull your chin above it. The best exercise for building the wide, V-shaped look of the back.',
  setup: ['Find a bar you can hang from with straight arms and your feet off the floor.', 'If you cannot do one yet: use the assisted pull-up machine, or loop a resistance band over the bar and put your knee in it.'],
  steps: [
    'Grip the bar a little wider than your shoulders, palms facing away.',
    'Hang with straight arms, then start by pulling your shoulders DOWN away from your ears before your arms bend.',
    'Drive your elbows down toward your ribs and pull your chest toward the bar.',
    'Keep going until your chin passes the bar.',
    'Lower yourself all the way back to straight arms, slowly.'
  ],
  tips: [
    'Think "pull the bar down to me" rather than "pull me up to the bar".',
    'Cannot do one? Do the lowering half only: jump to the top and take 5 seconds to lower. That builds the strength fastest.',
    'Once you can do 10-12, add weight with a dip belt and log it as added weight.'
  ],
  safety: [
    'Do not swing and kick unless you are deliberately doing kipping pull-ups. Uncontrolled swinging strains the shoulders.',
    'Come down under control. Dropping suddenly from the top with straight arms can strain the elbow or shoulder.',
    'If your elbows ache, switch to a neutral (palms facing each other) grip.'
  ],
  mistakes: ['Only going halfway down.', 'Shrugging up into the ears instead of pulling the shoulders down.']
},
{
  id: 'chin-up', name: 'Chin-Up', cat: 'Back', eq: 'Bodyweight', bw: true,
  prim: ['Lats', 'Biceps'], sec: ['Upper Back'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'The same as a pull-up but with your palms facing you. Your biceps help a lot more, so most people can do more of these than pull-ups. Great for the back and arms at the same time.',
  setup: ['Grip the bar about shoulder width, palms facing you.'],
  steps: ['Hang with straight arms.', 'Pull your shoulders down, then pull your chest up toward the bar.', 'Chin over the bar, then lower slowly to a full hang.'],
  tips: ['A great starting point if pull-ups are still too hard.'],
  safety: ['If you feel it in your elbow tendons, do not do these every session - alternate with neutral-grip pull-ups.'],
  mistakes: ['Letting the elbows travel forward instead of pulling them down.']
},
{
  id: 'lat-pulldown', name: 'Lat Pulldown', cat: 'Back', eq: 'Cable',
  prim: ['Lats'], sec: ['Biceps', 'Upper Back'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'A seated machine where you pull a bar down to your chest. It is the pull-up made adjustable - you pick the weight, so anyone can do it. This is the main back-width builder for most beginners.',
  setup: ['Adjust the thigh pad so it presses down firmly on your legs - this stops you lifting off the seat.', 'Set the pin to a light weight to start.'],
  steps: [
    'Stand up, grip the bar wider than your shoulders, then sit down and tuck your thighs under the pad.',
    'Sit tall, chest up, and lean back just slightly (about 10-15 degrees).',
    'Pull the bar down to the top of your chest by driving your elbows down and back.',
    'Squeeze your back for a moment.',
    'Let the bar rise slowly until your arms are straight and you feel your shoulders stretch upward.'
  ],
  tips: [
    'The stretch at the top matters as much as the squeeze at the bottom. Do not cut it short.',
    'If you only feel your arms, try gripping with a loose "hook" grip and think about pulling with your elbows.'
  ],
  safety: [
    'Never pull the bar behind your neck. It forces the shoulder into a bad position and offers no extra benefit.',
    'Do not let the weight yank you up out of the seat at the end of a set - lower the stack under control.'
  ],
  mistakes: ['Leaning way back and rowing the bar into your stomach.', 'Using body swing to move the stack.']
},
{
  id: 'neutral-grip-pulldown', name: 'Neutral-Grip Pulldown', cat: 'Back', eq: 'Cable',
  prim: ['Lats'], sec: ['Biceps', 'Upper Back'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'A lat pulldown using a V-handle so your palms face each other. Usually the most comfortable grip for the shoulders and elbows, and most people are strongest here.',
  setup: ['Clip a V-handle or parallel-grip bar to the pulldown cable.'],
  steps: ['Sit with thighs locked under the pad.', 'Pull the handle to your upper chest, elbows close to your body.', 'Control the return until your arms are straight.'],
  tips: ['Swap to this if wide-grip pulldowns bother your shoulders.'],
  safety: ['Keep your torso still. Rocking back and forth loads the lower back unnecessarily.'],
  mistakes: ['Leaning far back to grind out extra reps.']
},
{
  id: 'seated-cable-row', name: 'Seated Cable Row', cat: 'Back', eq: 'Cable',
  prim: ['Upper Back', 'Lats'], sec: ['Biceps', 'Rear Delts'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'You sit facing a low cable and pull a handle into your stomach. Builds thickness in the middle of the back with almost no strain on the lower back - a much safer alternative to barbell rows for beginners.',
  setup: ['Attach a V-handle. Sit down, put your feet on the platform, knees slightly bent.'],
  steps: [
    'Lean forward to grab the handle, then sit up tall with your arms straight.',
    'Let your shoulder blades reach forward so you feel a stretch in your upper back.',
    'Pull the handle into your stomach, driving your elbows back past your body.',
    'Squeeze your shoulder blades together for a second.',
    'Let your arms straighten again slowly, allowing the stretch.'
  ],
  tips: ['Letting the shoulder blades travel forward at the stretch and back at the squeeze is the whole point - do not lock your torso rigid.'],
  safety: [
    'Do not round your lower back to reach the handle at the start. Bend your knees more instead.',
    'Keep a slight bend in the knees. Locking them straight puts the stretch into your lower back.'
  ],
  mistakes: ['Rowing your whole torso back and forth like a boat.', 'Shrugging your shoulders up instead of pulling them back.']
},
{
  id: 'one-arm-dumbbell-row', name: 'One-Arm Dumbbell Row', cat: 'Back', eq: 'Dumbbell', uni: true,
  prim: ['Lats', 'Upper Back'], sec: ['Biceps', 'Rear Delts'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'You brace one hand and knee on a bench and row a dumbbell with the other arm. The bench supports you, so your lower back is protected, and working one side at a time gives a long range and a strong squeeze.',
  setup: ['Set a flat bench. Pick one dumbbell.'],
  steps: [
    'Put your left knee and left hand on the bench, right foot on the floor.',
    'Hold the dumbbell in your right hand, arm hanging straight down.',
    'Let your right shoulder blade reach down toward the floor - that is the stretch.',
    'Pull the dumbbell up toward your hip, leading with your elbow.',
    'Squeeze at the top, then lower all the way back down slowly.',
    'Finish all reps, then swap sides.'
  ],
  tips: [
    'Pull toward your hip rather than your armpit - it hits more lat.',
    'Keep your back flat and roughly parallel to the floor.'
  ],
  safety: [
    'Do not twist your torso to heave the weight up. Keep your shoulders level - twisting under load is how backs get tweaked.',
    'Do not let the dumbbell drop and yank your shoulder at the bottom.'
  ],
  mistakes: ['Rotating the whole body with each rep.', 'Pulling with the arm only instead of leading with the elbow.']
},
{
  id: 'chest-supported-dumbbell-row', name: 'Chest-Supported Dumbbell Row', cat: 'Back', eq: 'Dumbbell', paired: true,
  prim: ['Upper Back', 'Rear Delts'], sec: ['Lats', 'Biceps'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'You lie face-down on an incline bench and row two dumbbells. Because the bench holds you up, you cannot cheat and your lower back does nothing - all the work goes to the upper back.',
  setup: ['Set an incline bench to about 30-45 degrees. Place a dumbbell on the floor on each side.'],
  steps: ['Lie chest-down on the bench with your feet braced on the floor.', 'Pick up a dumbbell in each hand and let your arms hang straight down.', 'Row both dumbbells up, driving your elbows toward the ceiling.', 'Squeeze your shoulder blades together at the top.', 'Lower slowly until your arms are straight.'],
  tips: ['Elbows wide (out at 60-90 degrees) works the upper back and rear shoulders. Elbows tucked in works the lats.'],
  safety: ['Set the dumbbells down before you get off the bench - do not try to stand up holding them from that position.'],
  mistakes: ['Lifting your chest off the pad to help the weight up.']
},
{
  id: 't-bar-row', name: 'T-Bar Row', cat: 'Back', eq: 'Barbell',
  prim: ['Upper Back', 'Lats'], sec: ['Biceps', 'Rear Delts', 'Lower Back'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'A row using a bar anchored at one end (in a corner or a landmine holder) with a close neutral grip. Lets you load heavy while feeling more supported than a bent-over barbell row.',
  setup: ['Wedge one end of a barbell in a landmine holder or a corner. Load plates on the other end.', 'Slide a V-handle under the bar near the plates.'],
  steps: ['Straddle the bar and bend forward at the hips to about 45 degrees.', 'Grip the handle and let the weight stretch your back.', 'Row the handle into your stomach, elbows close to your body.', 'Lower under control without letting the plates rest on the floor.'],
  tips: ['Keep your chest up. If your back rounds, drop a plate.'],
  safety: ['Put a towel or mat under the free end of the bar so it does not damage the floor or slip out of the corner.', 'Same lower-back caution as bent-over rows.'],
  mistakes: ['Standing up with each rep to build momentum.']
},
{
  id: 'inverted-row', name: 'Inverted Row (Body Row)', cat: 'Back', eq: 'Bodyweight', bw: true,
  prim: ['Upper Back'], sec: ['Lats', 'Biceps', 'Abs'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'You lie under a waist-height bar and pull your chest up to it. It is the rowing version of a push-up, and the easiest way to build toward pull-ups.',
  setup: ['Set a barbell in a rack at about hip height, or use a Smith machine bar.'],
  steps: ['Lie under the bar and grip it slightly wider than your shoulders.', 'Straighten your body from head to heels, resting on your heels.', 'Squeeze your abs and glutes so you stay in one straight line.', 'Pull your chest to the bar, squeezing your shoulder blades together.', 'Lower slowly to straight arms.'],
  tips: ['Raise the bar to make it easier. Lower the bar, or put your feet on a bench, to make it harder.'],
  safety: ['Make sure the bar is properly seated in the rack hooks before you get under it.'],
  mistakes: ['Letting the hips sag toward the floor.']
},
{
  id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', cat: 'Back', eq: 'Cable',
  prim: ['Lats'], sec: ['Triceps', 'Abs'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'You stand facing a high cable and sweep a straight bar down to your thighs with locked arms. Because the elbows never bend, the biceps cannot help - it is the best exercise for learning what your lats actually feel like.',
  setup: ['Set the pulley high and attach a straight bar or rope. Stand about an arm\'s length back.'],
  steps: ['Hold the bar with straight (but not locked-hard) arms above head height.', 'Lean forward slightly from the hips.', 'Sweep the bar down in a big arc to your thighs, using only your shoulders.', 'Let it rise back overhead slowly into a stretch.'],
  tips: ['A great warm-up before heavy pulling - it wakes the lats up.'],
  safety: ['Use light weight. Heavy loads with straight arms put a lot of leverage on the shoulder joint.'],
  mistakes: ['Bending the elbows, which turns it into a triceps pushdown.']
},
{
  id: 'rack-pull', name: 'Rack Pull', cat: 'Back', eq: 'Barbell',
  prim: ['Traps', 'Lower Back'], sec: ['Glutes', 'Hamstrings', 'Forearms'], mech: 'Compound', force: 'Hinge', level: 'Intermediate',
  desc: 'A deadlift that starts from safety pins at knee height instead of the floor. The shorter range lets you handle more weight, which builds the traps, grip and lockout strength.',
  setup: ['Set the rack safety pins at knee height or just below and rest the loaded bar on them.'],
  steps: ['Set your grip and brace as you would for a deadlift.', 'Push your hips forward and stand tall.', 'Lower the bar back to the pins under control.'],
  tips: ['You will be able to lift more than your full deadlift - build up gradually anyway.'],
  safety: ['Do not bounce the bar off the pins; it is jarring on the spine and the equipment.', 'Do not lean back at the top.'],
  mistakes: ['Setting the pins so low it is just a deadlift with extra steps.']
},
{
  id: 'good-morning', name: 'Good Morning', cat: 'Back', eq: 'Barbell',
  prim: ['Hamstrings', 'Lower Back'], sec: ['Glutes'], mech: 'Compound', force: 'Hinge', level: 'Advanced',
  desc: 'With a bar on your upper back you bow forward at the hips and stand back up. It trains the hamstrings and lower back directly and makes your squat and deadlift stronger.',
  setup: ['Set the bar on your upper back exactly as for a back squat. Start with the empty bar.'],
  steps: ['Stand with feet hip-to-shoulder width, knees slightly soft.', 'Brace your core hard.', 'Push your hips straight backwards and let your chest lower toward horizontal.', 'Stop when you feel a strong stretch in your hamstrings.', 'Drive your hips forward to stand back up.'],
  tips: ['Go only as far as you can with a flat back. That range grows over time.'],
  safety: [
    'This is an advanced lift. Learn the Romanian deadlift first.',
    'Never round your back here - the bar on your shoulders multiplies the load on your spine.',
    'Always start inside a rack with the safety pins set, or with very light weight.'
  ],
  mistakes: ['Going too heavy too soon.', 'Squatting instead of hinging.']
},
{
  id: 'back-extension', name: 'Back Extension (Hyperextension)', cat: 'Back', eq: 'Bodyweight', bw: true,
  prim: ['Lower Back'], sec: ['Glutes', 'Hamstrings'], mech: 'Isolation', force: 'Hinge', level: 'Beginner',
  desc: 'You bend forward and back over a padded bench. It strengthens the lower back and glutes, which protects you on heavier lifts like squats and deadlifts.',
  setup: ['Adjust the pad so its top edge sits just below your hip bones, letting you bend freely at the hips.'],
  steps: ['Lock your ankles under the roller and cross your arms over your chest.', 'Bend forward at the hips until you feel a stretch in your hamstrings and lower back.', 'Squeeze your glutes and lift back up until your body is in one straight line.', 'Stop there - do not arch further back.'],
  tips: ['Hold a plate against your chest to add weight once bodyweight is easy.'],
  safety: ['Do not swing up hard and hyperextend at the top. That compresses the lower back.', 'If you get dizzy hanging forward, do fewer reps and come up slowly.'],
  mistakes: ['Arching violently at the top.']
},
{
  id: 'meadows-row', name: 'Meadows Row', cat: 'Back', eq: 'Barbell', uni: true,
  prim: ['Lats', 'Upper Back'], sec: ['Rear Delts', 'Biceps'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'A one-arm row using the end of a landmine-anchored barbell, standing side-on. The angle gives a big stretch at the bottom and a strong contraction at the top.',
  setup: ['Anchor one end of a barbell in a landmine or corner and load the other end.'],
  steps: ['Stand side-on to the loaded end in a staggered stance.', 'Bend over and grip the end of the bar with your outside hand, bracing your other hand on your knee.', 'Row the bar up and back toward your hip.', 'Lower into a full stretch, letting your shoulder blade travel forward.'],
  tips: ['Bracing your free hand on your knee takes the strain off your lower back.'],
  safety: ['Do not twist your spine to finish a rep.'],
  mistakes: ['Standing square to the bar instead of side-on.']
},
{
  id: 'seal-row', name: 'Seal Row', cat: 'Back', eq: 'Barbell',
  prim: ['Upper Back', 'Lats'], sec: ['Biceps', 'Rear Delts'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'A barbell row done lying face-down on a raised bench. Your lower back does nothing at all and you cannot cheat with momentum, so it is a pure upper-back exercise.',
  setup: ['Raise a flat bench on blocks or aerobic steps so the bar can hang below without touching the floor.'],
  steps: ['Lie face down with the loaded bar under you.', 'Let it hang at full stretch.', 'Row the bar up to the bench, squeezing your shoulder blades.', 'Lower to a complete stop.'],
  tips: ['Pause one second at the top of each rep.'],
  safety: ['Make sure the bench is stable on its blocks before you load the bar. Test it with light weight first.'],
  mistakes: ['Lifting the chest off the bench.']
},
{
  id: 'machine-row', name: 'Machine Row', cat: 'Back', eq: 'Machine',
  prim: ['Upper Back', 'Lats'], sec: ['Biceps', 'Rear Delts'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'A seated rowing machine with a chest pad. Fixed path, chest supported, zero balance required - one of the easiest and safest ways to build back thickness.',
  setup: ['Adjust the seat so the handles are level with your mid chest and your chest rests against the pad.'],
  steps: ['Sit with your chest against the pad and grip the handles.', 'Pull the handles back, driving your elbows behind you.', 'Squeeze your shoulder blades, then return slowly to a full stretch.'],
  tips: ['Most of these machines offer a wide overhand and a narrow neutral grip - use both across your training week.'],
  safety: ['Keep your chest on the pad. Pulling away from it puts the load on your lower back.'],
  mistakes: ['Yanking with the arms and letting the shoulders roll forward at the end.']
},
{
  id: 'barbell-shrug', name: 'Barbell Shrug', cat: 'Back', eq: 'Barbell',
  prim: ['Traps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'You hold a heavy barbell and lift your shoulders straight up toward your ears. This builds the traps - the muscles between your neck and shoulders.',
  setup: ['Load a bar in a rack at thigh height so you do not have to deadlift it up.'],
  steps: ['Stand tall holding the bar at arm\'s length in front of your thighs.', 'Keep your arms completely straight - they are just hooks.', 'Lift your shoulders straight up as high as you can.', 'Hold for a second at the top, then lower slowly to a full stretch.'],
  tips: ['Use lifting straps if your grip gives out before your traps do.', 'Do not roll your shoulders - straight up and straight down.'],
  safety: ['Never roll your neck or head during shrugs. Look straight ahead.', 'Rolling the shoulders backwards under heavy load grinds the shoulder joint.'],
  mistakes: ['Bending the elbows so it becomes a half-row.', 'Bouncing with no pause at the top.']
},
{
  id: 'dumbbell-shrug', name: 'Dumbbell Shrug', cat: 'Back', eq: 'Dumbbell', paired: true,
  prim: ['Traps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Shrugs with a dumbbell in each hand at your sides. The weights hang beside you instead of in front, which lets your shoulders travel a little higher.',
  setup: ['Pick up a heavy pair of dumbbells and stand tall.'],
  steps: ['Let the dumbbells hang at your sides, arms straight.', 'Shrug your shoulders straight up.', 'Pause, then lower slowly.'],
  tips: ['Hold the top position for two full seconds every rep.'],
  safety: ['Set them down carefully - do not drop heavy dumbbells while standing.'],
  mistakes: ['Using so much weight the shoulders barely move.']
}
,
/* ========================== SHOULDERS ========================== */
{
  id: 'overhead-press', name: 'Standing Overhead Press', cat: 'Shoulders', eq: 'Barbell',
  prim: ['Shoulders'], sec: ['Triceps', 'Traps', 'Abs'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'You press a barbell from your shoulders to overhead while standing. It is the main shoulder-building lift and it also forces your abs and lower back to work hard to keep you upright.',
  setup: ['Set the bar in a rack at upper-chest height.', 'Feet shoulder width, bar resting on your front shoulders.'],
  steps: [
    'Grip the bar just outside your shoulders with your forearms vertical.',
    'Unrack it and step back. Rest it on your front shoulders, elbows slightly in front of the bar.',
    'Squeeze your glutes and abs tight so your ribs do not flare.',
    'Move your head back slightly so the bar can pass your face, then press straight up.',
    'As the bar clears your forehead, push your head back through so the bar finishes directly over your ears.',
    'Lock out with the bar over the middle of your feet, then lower it back to your shoulders under control.'
  ],
  tips: ['The bar must travel in a straight vertical line. That means your head moves, not the bar.', 'Squeezing your glutes stops you arching your lower back.'],
  safety: [
    'Do not lean back to press the bar. If you find yourself arching hard, the weight is too heavy - that position strains the lower back badly.',
    'Press inside a rack with the safety pins set, or be ready to drop the bar forward safely.',
    'If you cannot raise your arms fully overhead without arching, work on shoulder mobility first and press dumbbells at an incline in the meantime.'
  ],
  mistakes: ['Pressing forward around the face instead of straight up.', 'Using leg drive (that is a push press, a different lift).']
},
{
  id: 'seated-dumbbell-shoulder-press', name: 'Seated Dumbbell Shoulder Press', cat: 'Shoulders', eq: 'Dumbbell', paired: true,
  prim: ['Shoulders'], sec: ['Triceps'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'Pressing two dumbbells overhead while seated with back support. Easier to learn than the barbell version and much kinder to the lower back, since the bench holds you upright.',
  setup: ['Set an adjustable bench to fully upright (or one notch back from vertical).', 'Rest the dumbbells on your thighs before you sit back.'],
  steps: [
    'Sit with your back against the pad, dumbbells on your thighs.',
    'Kick one knee up to help lift each dumbbell to shoulder height, palms facing forward.',
    'Elbows should be slightly in front of your body, not straight out to the sides.',
    'Press both dumbbells up until your arms are almost straight, bringing them slightly toward each other.',
    'Lower them back to ear level under control.'
  ],
  tips: ['Turning your palms to face each other (neutral grip) is easier on the shoulders if you feel any pinching.'],
  safety: [
    'Do not lower the dumbbells much below ear height - going deeper strains the shoulder joint with little extra benefit.',
    'Getting heavy dumbbells into position is the hardest part. If you cannot kick them up cleanly, go lighter.',
    'Keep your back against the pad. Arching off it to press means the weight is too heavy.'
  ],
  mistakes: ['Clanging the dumbbells together overhead.', 'Flaring the elbows straight out to the sides.']
},
{
  id: 'arnold-press', name: 'Arnold Press', cat: 'Shoulders', eq: 'Dumbbell', paired: true,
  prim: ['Shoulders'], sec: ['Triceps'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'A dumbbell shoulder press where you rotate your palms from facing you to facing forward as you push up. The twist brings the front and side of the shoulder into one movement.',
  setup: ['Sit on an upright bench with a dumbbell in each hand.'],
  steps: ['Start with the dumbbells in front of your chin, palms facing you, elbows tucked in.', 'As you press up, rotate your palms outward so they face forward at the top.', 'Reverse the rotation on the way down.'],
  tips: ['Go lighter than a normal shoulder press - the rotation makes it harder.'],
  safety: ['Rotate smoothly. Jerking the twist under heavy load is rough on the shoulder joint.'],
  mistakes: ['Rotating too late, at the very top, instead of throughout the press.']
},
{
  id: 'machine-shoulder-press', name: 'Machine Shoulder Press', cat: 'Shoulders', eq: 'Machine',
  prim: ['Shoulders'], sec: ['Triceps'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'A seated overhead press on a fixed machine. No balancing, no getting heavy dumbbells into place - just sit down and press. Ideal for beginners.',
  setup: ['Adjust the seat so the handles start level with your shoulders or just above.'],
  steps: ['Sit with your back flat against the pad.', 'Press the handles overhead until your arms are almost straight.', 'Lower slowly back to shoulder height.'],
  tips: ['Do not lock your elbows hard at the top.'],
  safety: ['If the seat is too low the handles start too far behind you and the shoulder is put in a stressed position. Adjust it properly.'],
  mistakes: ['Letting the stack crash down at the bottom of each rep.']
},
{
  id: 'dumbbell-lateral-raise', name: 'Dumbbell Lateral Raise', cat: 'Shoulders', eq: 'Dumbbell', paired: true,
  prim: ['Shoulders'], sec: ['Traps'], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'You lift two dumbbells out to your sides like wings. This targets the side of the shoulder, which is what makes shoulders look wide. Almost nothing else trains it directly.',
  setup: ['Pick LIGHT dumbbells. Most people should start with 4-8 kg. This is not a heavy exercise.'],
  steps: [
    'Stand tall with a dumbbell in each hand at your sides, palms facing your body.',
    'Bend your elbows very slightly and keep that bend fixed.',
    'Lift both arms out to the sides until they are level with your shoulders - no higher.',
    'Lead with your elbows, as if you are pouring water from a jug slightly.',
    'Lower slowly, taking about 2-3 seconds, resisting all the way down.'
  ],
  tips: [
    'Going above shoulder height brings the traps in and takes work off the side delt.',
    'Leaning forward slightly (about 10 degrees) can help you feel it better.',
    'Higher reps work well here - 12 to 20.'
  ],
  safety: [
    'Do not swing the weights up with your body. Using momentum with heavy dumbbells is a common cause of shoulder impingement.',
    'If you feel pinching at the top, stop a bit lower and turn your thumbs slightly up.'
  ],
  mistakes: ['Way too much weight and a big body swing.', 'Shrugging the shoulders up as the arms rise.']
},
{
  id: 'cable-lateral-raise', name: 'Cable Lateral Raise', cat: 'Shoulders', eq: 'Cable', uni: true,
  prim: ['Shoulders'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A one-arm lateral raise using a low cable. The cable keeps tension on the side shoulder at the bottom of the movement, where dumbbells lose it entirely.',
  setup: ['Set the pulley to the lowest position and clip on a single handle.'],
  steps: ['Stand side-on to the machine and take the handle in your outside hand, across the front of your body.', 'Hold the machine frame with your other hand for balance.', 'Raise your arm out to the side up to shoulder height.', 'Lower slowly all the way back across your body.'],
  tips: ['Excellent paired with dumbbell raises - do dumbbells first, cables second.'],
  safety: ['Keep the weight light and the movement smooth; jerking sideways on a cable is easy to do and hard on the joint.'],
  mistakes: ['Leaning away from the machine to help the arm up.']
},
{
  id: 'machine-lateral-raise', name: 'Machine Lateral Raise', cat: 'Shoulders', eq: 'Machine',
  prim: ['Shoulders'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A seated machine that raises your arms out to the sides. The fixed path makes it very hard to cheat, so it is one of the best ways to train side delts to failure safely.',
  setup: ['Adjust the seat so the pivot point of the machine lines up with your shoulder joint.'],
  steps: ['Sit with your back against the pad and your upper arms against the pads.', 'Push your arms out and up to shoulder height.', 'Pause, then lower slowly.'],
  tips: ['Push with your elbows into the pads, not your hands.'],
  safety: ['Stop at shoulder height even if the machine allows more.'],
  mistakes: ['Seat height wrong, so your shoulders and the machine pivot do not line up.']
},
{
  id: 'front-raise', name: 'Dumbbell Front Raise', cat: 'Shoulders', eq: 'Dumbbell', paired: true,
  prim: ['Shoulders'], sec: ['Chest'], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'You raise dumbbells straight out in front of you to shoulder height. Targets the front of the shoulder. Most people already get plenty of front-delt work from pressing, so treat this as optional.',
  setup: ['Light dumbbells, standing tall.'],
  steps: ['Hold the dumbbells in front of your thighs, palms facing you.', 'Raise one or both arms straight forward to shoulder height.', 'Lower slowly.'],
  tips: ['Alternating arms lets you focus better and keeps your torso still.'],
  safety: ['Do not swing your body or arch your back to throw the weight up.'],
  mistakes: ['Raising far above shoulder height and shrugging.']
},
{
  id: 'rear-delt-fly', name: 'Rear Delt Fly (Bent-Over Lateral Raise)', cat: 'Shoulders', eq: 'Dumbbell', paired: true,
  prim: ['Rear Delts'], sec: ['Upper Back', 'Traps'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Bent forward, you raise dumbbells out to the sides. This works the back of the shoulder - a small muscle that is almost always underdeveloped and that keeps your shoulders healthy and your posture upright.',
  setup: ['Very light dumbbells. Sit on the end of a bench or stand and bend forward.'],
  steps: ['Bend forward at the hips until your chest is near your thighs (or lie face-down on an incline bench).', 'Let the dumbbells hang below you, palms facing each other, elbows slightly bent.', 'Raise your arms out to the sides until they are level with your shoulders.', 'Squeeze your shoulder blades slightly, then lower slowly.'],
  tips: ['Think about pulling your elbows apart, not lifting the weights.', 'Do 15-20 reps. The rear delt responds much better to lighter, higher-rep work.'],
  safety: ['If bending over makes you lightheaded, do it lying face-down on an incline bench instead.', 'Do not round your lower back while bent over.'],
  mistakes: ['Using too much weight and turning it into a row.', 'Standing too upright, so gravity does not load the rear delts.']
},
{
  id: 'reverse-pec-deck', name: 'Reverse Pec Deck', cat: 'Shoulders', eq: 'Machine',
  prim: ['Rear Delts'], sec: ['Upper Back'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'The pec deck machine used backwards - you sit facing the pad and push the handles out behind you. The most convenient and controlled way to train rear delts.',
  setup: ['Turn the seat to face the machine and set the arms to the narrow starting position.', 'Adjust the seat so the handles are at shoulder height.'],
  steps: ['Sit facing the pad, chest against it.', 'Grip the handles with straight-ish arms in front of you.', 'Push them out and back in a wide arc until they are level with your shoulders.', 'Squeeze, then return slowly.'],
  tips: ['A neutral grip (palms facing each other) usually feels best.'],
  safety: ['Keep the reps smooth. Slamming the handles back at the end range is hard on the shoulder.'],
  mistakes: ['Bending the elbows to turn it into a row.']
},
{
  id: 'face-pull', name: 'Face Pull', cat: 'Shoulders', eq: 'Cable',
  prim: ['Rear Delts', 'Upper Back'], sec: ['Traps'], mech: 'Compound', force: 'Pull', level: 'Beginner',
  desc: 'You pull a rope toward your face with your elbows high. This is the single best exercise for shoulder health and posture, and it balances out all the pressing you do. Almost everyone should be doing these.',
  setup: ['Attach a rope to a cable set at face or upper-chest height. Use light weight.'],
  steps: [
    'Grip the rope with both hands, thumbs pointing back toward you.',
    'Step back so the cable is taut and lean back very slightly.',
    'Pull the rope toward your forehead, separating your hands as you go.',
    'Finish with your hands beside your ears and your elbows high, level with your shoulders.',
    'Return slowly under control.'
  ],
  tips: ['Think "pull apart" as much as "pull back".', 'Do 15-20 reps. This is a health exercise, not an ego lift.'],
  safety: ['If you load it so heavy that your elbows drop below your wrists, you are doing a high row instead and losing the benefit.'],
  mistakes: ['Too much weight.', 'Letting the elbows drop.']
},
{
  id: 'upright-row', name: 'Upright Row', cat: 'Shoulders', eq: 'Barbell',
  prim: ['Traps', 'Shoulders'], sec: ['Biceps'], mech: 'Compound', force: 'Pull', level: 'Intermediate',
  desc: 'You pull a barbell straight up the front of your body, leading with the elbows. Works the traps and side shoulders together.',
  setup: ['Use a grip about shoulder width or slightly wider - NOT narrow.'],
  steps: ['Hold the bar in front of your thighs.', 'Pull it up the front of your body, leading with your elbows.', 'Stop when your upper arms are level with the floor - about chest height.', 'Lower slowly.'],
  tips: ['A wider grip and stopping at chest height is far kinder to the shoulders.'],
  safety: [
    'Pulling a narrow grip all the way to your chin is a well-known cause of shoulder impingement. Do not do it.',
    'If you feel any pinching, skip this exercise - lateral raises and shrugs cover the same muscles safely.'
  ],
  mistakes: ['Narrow grip pulled to the chin.', 'Swinging the body to get the bar moving.']
},
{
  id: 'push-press', name: 'Push Press', cat: 'Shoulders', eq: 'Barbell',
  prim: ['Shoulders'], sec: ['Triceps', 'Quads', 'Glutes'], mech: 'Compound', force: 'Push', level: 'Advanced',
  desc: 'An overhead press where you use a small dip and drive of the legs to start the bar moving. This lets you handle more weight than a strict press, which overloads the shoulders and triceps at the top.',
  setup: ['Bar racked at upper-chest height, same as an overhead press.'],
  steps: ['Unrack the bar onto your front shoulders and step back.', 'Dip by bending your knees about 10 cm, keeping your torso vertical.', 'Reverse instantly and drive up with your legs, letting that momentum start the bar.', 'Finish the lift with your arms, locking out overhead.', 'Lower to your shoulders, absorb it with soft knees, and reset.'],
  tips: ['The dip is short and fast, and your torso stays upright - do not lean forward.'],
  safety: ['Only learn this after your strict press is solid.', 'Catching heavy bars on your shoulders repeatedly can be jarring - lower under control.'],
  mistakes: ['Dipping too deep and turning it into a squat.']
},

/* ========================== BICEPS ========================== */
{
  id: 'barbell-curl', name: 'Barbell Curl', cat: 'Arms', eq: 'Barbell',
  prim: ['Biceps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'The classic biceps exercise. You curl a barbell from your thighs up to your shoulders. Because both arms work together on one bar, you can load it heavier than dumbbells.',
  setup: ['Load a straight bar or EZ bar. Start light - the biceps are a small muscle.'],
  steps: [
    'Stand holding the bar at arm\'s length, palms facing forward, hands about shoulder width.',
    'Pin your elbows to your sides. They stay there the whole set.',
    'Curl the bar up toward your shoulders by bending only at the elbow.',
    'Squeeze at the top for a moment.',
    'Lower slowly until your arms are completely straight.'
  ],
  tips: ['Lowering slowly (2-3 seconds) builds more than heaving it up fast.', 'If your wrists hurt on a straight bar, use an EZ bar - the angled grip fixes it for most people.'],
  safety: [
    'Do not swing your body and use your lower back to throw the weight up. That is the fastest way to hurt your back on a small exercise.',
    'Do not lock your elbows out hard and bounce at the bottom - that strains the biceps tendon.'
  ],
  mistakes: ['Elbows drifting forward, which brings the front shoulders in.', 'Cutting the range short at the bottom.']
},
{
  id: 'dumbbell-curl', name: 'Dumbbell Curl', cat: 'Arms', eq: 'Dumbbell', paired: true,
  prim: ['Biceps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Curling a dumbbell in each hand. Because your hands are free, you can turn your palm up as you curl, which contracts the biceps more fully than a fixed bar.',
  setup: ['Two dumbbells, standing or seated on an upright bench.'],
  steps: ['Hold the dumbbells at your sides, palms facing your body.', 'Curl one or both up, rotating your palm to face the ceiling as you go.', 'Squeeze at the top, then lower slowly and let the palm rotate back.'],
  tips: ['Alternating arms lets you focus on each side and helps balance out a weaker arm.', 'Log left and right weights separately in this app if one arm needs lighter weight.'],
  safety: ['Keep your elbows at your sides - swinging them forward brings in the shoulders and can strain them.'],
  mistakes: ['Rocking backwards to help the weight up.']
},
{
  id: 'hammer-curl', name: 'Hammer Curl', cat: 'Arms', eq: 'Dumbbell', paired: true,
  prim: ['Biceps', 'Forearms'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'A curl with your palms facing each other, like holding a hammer. This hits a muscle underneath the biceps (the brachialis) plus the forearm, which makes the whole arm look thicker.',
  setup: ['Two dumbbells, palms facing each other.'],
  steps: ['Stand with dumbbells at your sides, palms facing in.', 'Curl up without rotating your wrists - palms stay facing each other.', 'Squeeze, then lower slowly to straight arms.'],
  tips: ['You can usually go a bit heavier here than on a normal curl.', 'Try curling across your body toward the opposite shoulder for a variation.'],
  safety: ['Keep the elbows tucked. Same swinging rules as any curl.'],
  mistakes: ['Letting the elbows travel forward.']
},
{
  id: 'incline-dumbbell-curl', name: 'Incline Dumbbell Curl', cat: 'Arms', eq: 'Dumbbell', paired: true,
  prim: ['Biceps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Intermediate',
  desc: 'Curling while lying back on an incline bench. Your arms hang behind your body, which stretches the biceps more than any other curl. Very effective, and it makes light weight feel heavy.',
  setup: ['Set a bench to about 45-60 degrees and sit back with a dumbbell in each hand.'],
  steps: ['Lie back with your arms hanging straight down behind you.', 'Keep your upper arms still and curl the dumbbells up.', 'Lower slowly all the way back into the stretch.'],
  tips: ['Use noticeably lighter weight than standing curls. The stretch position is much harder.'],
  safety: ['Do not bounce out of the bottom stretch position - that is where biceps tears happen. Control it.'],
  mistakes: ['Lifting the shoulders off the bench to help.']
},
{
  id: 'preacher-curl', name: 'Preacher Curl', cat: 'Arms', eq: 'EZ Bar',
  prim: ['Biceps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Curling with the backs of your upper arms resting on a slanted pad. The pad stops you swinging completely, so the biceps get all the work.',
  setup: ['Adjust the seat so the top of the pad sits under your armpits and your chest touches it.'],
  steps: ['Rest the backs of your upper arms flat on the pad, arms straight down the slope.', 'Curl the bar up toward your chin.', 'Squeeze, then lower slowly until your arms are almost straight.'],
  tips: ['Have someone hand you the bar for heavy sets, or use the machine version.'],
  safety: [
    'Never let your arms snap straight at the bottom. The preacher pad puts the biceps in a stretched position where a fast, heavy lockout can tear the tendon.',
    'Stop just short of full extension and control every rep.'
  ],
  mistakes: ['Lifting the elbows off the pad at the top.', 'Dropping the weight fast at the bottom.']
},
{
  id: 'cable-curl', name: 'Cable Curl', cat: 'Arms', eq: 'Cable',
  prim: ['Biceps'], sec: ['Forearms'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'A curl using a low cable and a straight or EZ bar. The cable pulls constantly, so the biceps never get a rest at the bottom or the top of the rep.',
  setup: ['Set the pulley at the bottom and attach a straight or EZ bar. Stand a step back.'],
  steps: ['Hold the bar with palms up and elbows pinned at your sides.', 'Curl up to your shoulders.', 'Squeeze, then lower slowly to straight arms without letting the stack rest.'],
  tips: ['Great for drop sets - just move the pin down and keep going.'],
  safety: ['Do not lean back against the pull of the cable.'],
  mistakes: ['Standing too close so the cable angle goes slack at the bottom.']
},
{
  id: 'concentration-curl', name: 'Concentration Curl', cat: 'Arms', eq: 'Dumbbell', uni: true,
  prim: ['Biceps'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Seated, you brace your elbow against the inside of your thigh and curl one dumbbell. Total isolation - nothing else can help, which makes it great for building the biceps peak and fixing side-to-side differences.',
  setup: ['Sit on a bench with your legs spread and one dumbbell between your feet.'],
  steps: ['Lean forward and brace the back of your upper arm against the inside of your thigh.', 'Let the dumbbell hang with a straight arm.', 'Curl it up toward your opposite shoulder.', 'Squeeze hard at the top, then lower all the way down.'],
  tips: ['Slow and controlled - this is not a heavy exercise.'],
  safety: ['Do not round your back badly while leaning over; keep your chest up.'],
  mistakes: ['Using the leg to push the arm up.']
},
{
  id: 'ez-bar-reverse-curl', name: 'Reverse Curl', cat: 'Arms', eq: 'EZ Bar',
  prim: ['Forearms', 'Biceps'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'A curl with your palms facing down. This hits the top of the forearm and the brachialis, building forearm size and grip strength.',
  setup: ['Use an EZ bar with an overhand grip. Much lighter than a normal curl.'],
  steps: ['Hold the bar with palms facing down, elbows at your sides.', 'Curl up to chest height, keeping the wrists straight.', 'Lower slowly.'],
  tips: ['Expect to use about half of what you use on a normal curl. That is normal.'],
  safety: ['Keep the wrists straight, not bent back. Bending them under load causes wrist strain.'],
  mistakes: ['Letting the wrists collapse backwards.']
},
{
  id: 'machine-curl', name: 'Machine Biceps Curl', cat: 'Arms', eq: 'Machine',
  prim: ['Biceps'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'A seated curl machine with an arm pad. Fixed path and no way to cheat, which makes it an easy and safe way to finish off the biceps.',
  setup: ['Adjust the seat so your armpits rest at the top of the pad and your elbows line up with the machine pivot.'],
  steps: ['Rest your upper arms on the pad and grip the handles.', 'Curl up, squeeze, and lower under control.'],
  tips: ['Good for high-rep burnout sets at the end of an arm workout.'],
  safety: ['Do not let the weight snap your arms straight at the bottom.'],
  mistakes: ['Elbows not lined up with the machine pivot point.']
},

/* ========================== TRICEPS ========================== */
{
  id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', cat: 'Arms', eq: 'Barbell',
  prim: ['Triceps'], sec: ['Chest', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'A bench press with your hands about shoulder width. The narrower grip makes the triceps do most of the work. It is the heaviest triceps exercise you can do.',
  setup: ['Same bench setup as a normal bench press. Hands about shoulder width apart - not narrower.'],
  steps: ['Lie down, shoulder blades squeezed, grip at shoulder width.', 'Unrack and lower the bar to your lower chest, keeping your elbows tucked close to your body.', 'Press back up, focusing on straightening your arms.'],
  tips: ['Elbows tucked in is what makes it a triceps exercise. If they flare, it becomes a bench press.'],
  safety: [
    'Do not grip narrower than shoulder width - it puts a lot of strain on the wrists and elbows without adding triceps work.',
    'Use safety bars or a spotter, same as any bench press.'
  ],
  mistakes: ['Gripping so narrow the hands almost touch.', 'Flaring the elbows.']
},
{
  id: 'triceps-pushdown', name: 'Triceps Pushdown (Rope or Bar)', cat: 'Arms', eq: 'Cable',
  prim: ['Triceps'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'Standing at a high cable, you push a bar or rope down until your arms are straight. The easiest and most reliable triceps exercise - safe, easy to feel, and easy to load.',
  setup: ['Set the pulley high and attach a straight bar, V-bar or rope.'],
  steps: [
    'Stand facing the machine, about half a step back.',
    'Grip the attachment and pull your elbows in to your sides.',
    'Keeping your elbows pinned, push down until your arms are completely straight.',
    'Squeeze the back of your arms for a second.',
    'Let it come back up until your forearms are just past parallel with the floor - no higher.'
  ],
  tips: ['With a rope, pull your hands apart at the bottom for a stronger contraction.', 'Lean forward very slightly and keep your torso still.'],
  safety: ['Do not use so much weight that you have to lean your whole bodyweight onto the bar - that turns it into a bad dip and strains the shoulders.'],
  mistakes: ['Elbows drifting forward and away from the body.', 'Bouncing the weight with body movement.']
},
{
  id: 'overhead-triceps-extension', name: 'Overhead Triceps Extension', cat: 'Arms', eq: 'Dumbbell',
  prim: ['Triceps'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'With your arms overhead you lower a weight behind your head and press it back up. Having the arms overhead stretches the long head of the triceps - the part that adds most size to the back of the arm.',
  setup: ['One dumbbell held with both hands, or a rope on a low cable. Sit on an upright bench for back support.'],
  steps: [
    'Hold the dumbbell with both hands, cupping the top end, and press it straight overhead.',
    'Keep your elbows pointing forward and close to your head.',
    'Bend your elbows and lower the weight behind your head until you feel a strong stretch.',
    'Press back up until your arms are straight.'
  ],
  tips: ['A cable rope version keeps constant tension and is easier on the elbows.'],
  safety: [
    'Only your forearms move. If your elbows flare wide, the strain moves to the elbow joint.',
    'Start light. The stretched overhead position is where triceps tendons get irritated.',
    'Do not do these behind your head with a heavy dumbbell you cannot control - dropping it lands on your neck.'
  ],
  mistakes: ['Elbows flaring out to the sides.', 'Going too heavy in a vulnerable position.']
},
{
  id: 'skull-crusher', name: 'Skull Crusher (Lying Triceps Extension)', cat: 'Arms', eq: 'EZ Bar',
  prim: ['Triceps'], sec: [], mech: 'Isolation', force: 'Push', level: 'Intermediate',
  desc: 'Lying on a bench, you lower a bar toward your forehead by bending only your elbows, then press it back. One of the best triceps mass builders.',
  setup: ['Use an EZ bar - it is much easier on the wrists. Lie on a flat bench.'],
  steps: ['Press the bar up so your arms are straight above your chest.', 'Tilt your arms back slightly so they point toward your head, not straight up.', 'Bend only at the elbows and lower the bar toward your forehead or just behind your head.', 'Press back up by straightening your arms.'],
  tips: ['Lowering behind your head rather than to your forehead keeps more tension on the triceps and is easier on the elbows.'],
  safety: [
    'The name is a joke but the risk is real - always control the bar and never do these to failure alone with a heavy straight bar.',
    'If your elbows ache, reduce the weight and switch to a rope or dumbbells. Elbow pain here is very common and worth respecting.'
  ],
  mistakes: ['Letting the elbows flare wide.', 'Using the shoulders to press the bar back up.']
},
{
  id: 'triceps-dip', name: 'Triceps Dip (Parallel Bars)', cat: 'Arms', eq: 'Bodyweight', bw: true,
  prim: ['Triceps'], sec: ['Chest', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Intermediate',
  desc: 'A dip on parallel bars keeping your body upright, so the triceps take the load instead of the chest. A very effective bodyweight arm builder.',
  setup: ['Parallel bars, or use an assisted dip machine if you cannot do bodyweight yet.'],
  steps: ['Support yourself on the bars with straight arms and an upright torso.', 'Bend your elbows straight back, keeping them close to your body.', 'Lower until your elbows reach about 90 degrees.', 'Push back up to straight arms.'],
  tips: ['Staying upright = triceps. Leaning forward = chest.'],
  safety: ['Do not drop below 90 degrees at the elbow - deeper offers nothing and stresses the shoulder.', 'Get on and off the bars under control.'],
  mistakes: ['Going too deep.', 'Letting the elbows flare out to the sides.']
},
{
  id: 'bench-dip', name: 'Bench Dip', cat: 'Arms', eq: 'Bodyweight', bw: true,
  prim: ['Triceps'], sec: ['Shoulders'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'With your hands behind you on a bench and feet on the floor, you lower and push yourself back up. An easy bodyweight triceps exercise you can do anywhere.',
  setup: ['Sit on a bench, hands beside your hips gripping the edge. Slide your hips off the front.'],
  steps: ['Support yourself with straight arms, hips just in front of the bench.', 'Bend your elbows straight back and lower until your upper arms are parallel to the floor.', 'Push back up.'],
  tips: ['Bend your knees to make it easier, straighten the legs or elevate the feet to make it harder.'],
  safety: ['This position rolls the shoulders forward, which some people find uncomfortable. Do not go deep, and skip it entirely if you feel pinching - pushdowns are a better option.'],
  mistakes: ['Dropping very deep and stressing the shoulder capsule.']
},
{
  id: 'triceps-kickback', name: 'Triceps Kickback', cat: 'Arms', eq: 'Dumbbell', uni: true,
  prim: ['Triceps'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'Bent over with your upper arm parallel to your body, you straighten your elbow behind you. Light and simple, with a strong squeeze at the end of the movement.',
  setup: ['One light dumbbell. Brace your free hand and knee on a bench.'],
  steps: ['Bend forward with your upper arm tucked against your ribs, parallel to the floor.', 'Straighten your elbow until your whole arm is straight behind you.', 'Squeeze for a second, then bend the elbow back to 90 degrees.'],
  tips: ['Your upper arm never moves. Only the forearm swings.'],
  safety: ['Do not snap the elbow straight hard - control the lockout.'],
  mistakes: ['Swinging the whole arm instead of just extending the elbow.']
},
{
  id: 'machine-triceps-extension', name: 'Machine Triceps Extension', cat: 'Arms', eq: 'Machine',
  prim: ['Triceps'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A seated machine that extends your arms against a fixed path. Very easy to set up and safe to push hard on.',
  setup: ['Adjust the seat so your elbows line up with the machine pivot and your upper arms rest on the pad.'],
  steps: ['Grip the handles and press down or forward until your arms are straight.', 'Squeeze, then return slowly.'],
  tips: ['A good finisher when your elbows are already tired from free weights.'],
  safety: ['If your elbows line up wrong with the pivot, you will feel it in the joint. Adjust before adding weight.'],
  mistakes: ['Using your bodyweight to push the handles down.']
},

/* ========================== FOREARMS ========================== */
{
  id: 'wrist-curl', name: 'Wrist Curl', cat: 'Arms', eq: 'Dumbbell', paired: true,
  prim: ['Forearms'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Resting your forearms on a bench, you curl the weight using only your wrists. Builds the inside of the forearm and improves grip.',
  setup: ['Sit on a bench with your forearms resting on your thighs or the bench, palms facing up, wrists hanging over the edge.'],
  steps: ['Let the weight roll down toward your fingertips.', 'Curl it back up by closing your hand and flexing your wrist.', 'Lower slowly.'],
  tips: ['High reps (15-25) work best for forearms.'],
  safety: ['Light weight only. The wrist is a small joint.'],
  mistakes: ['Moving the elbow instead of the wrist.']
},
{
  id: 'reverse-wrist-curl', name: 'Reverse Wrist Curl', cat: 'Arms', eq: 'Dumbbell', paired: true,
  prim: ['Forearms'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'The same as a wrist curl but with palms facing down. Works the top of the forearm, which helps prevent elbow pain from heavy gripping.',
  setup: ['Forearms on the bench, palms facing down, wrists over the edge.'],
  steps: ['Let your hands drop down.', 'Lift them by extending your wrists.', 'Lower slowly.'],
  tips: ['Use very light weight - much lighter than the palms-up version.'],
  safety: ['Great preventative work if you get tennis elbow, but stop if it is currently painful.'],
  mistakes: ['Using too much weight and moving the whole arm.']
},
{
  id: 'farmers-walk', name: "Farmer's Walk", cat: 'Full Body', eq: 'Dumbbell', paired: true,
  prim: ['Forearms', 'Traps'], sec: ['Abs', 'Glutes', 'Quads'], mech: 'Compound', force: 'Carry', level: 'Beginner',
  desc: 'You pick up a heavy weight in each hand and walk. It builds grip, traps, core and general toughness, and it is one of the most practical exercises there is.',
  setup: ['Two heavy dumbbells, kettlebells or farmer\'s handles. Clear a walking path.'],
  steps: ['Squat down with a flat back and grip the weights.', 'Stand up, shoulders back, chest tall.', 'Walk with short, controlled steps for a set distance or time.', 'Set the weights down by squatting, not by bending your back.'],
  tips: ['Log the per-hand weight and use the reps field for seconds or metres walked.'],
  safety: ['Put them down with a proper squat - most injuries here happen at the end when people are tired and just bend over.', 'Watch where you walk. Do not carry heavy weights through crowded areas.'],
  mistakes: ['Shrugging and leaning to one side.', 'Dropping the weights from standing height.']
}
,
/* ========================== LEGS ========================== */
{
  id: 'back-squat', name: 'Barbell Back Squat', cat: 'Legs', eq: 'Barbell',
  prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Lower Back', 'Abs', 'Adductors'], mech: 'Compound', force: 'Squat', level: 'Intermediate',
  desc: 'You hold a barbell across your upper back, squat down, and stand back up. It is the single best exercise for building the thighs and glutes, and it makes your whole body stronger.',
  setup: [
    'Set the bar in the rack at about upper-chest height - you should have to dip slightly under it, not tiptoe.',
    'Set the safety bars at roughly the height of the bar at the bottom of your squat. Test this with an empty bar first.',
    'Load plates evenly and clip them.'
  ],
  steps: [
    'Step under the bar and rest it across your upper back muscles, NOT on the bony part of your neck.',
    'Grip the bar with both hands, squeeze your shoulder blades together to make a shelf of muscle.',
    'Stand up to lift the bar off the hooks, then take two or three small steps back.',
    'Set your feet shoulder width or slightly wider, toes turned out 15-30 degrees.',
    'Take a big breath into your belly and brace your core hard.',
    'Push your hips back and bend your knees at the same time, lowering straight down.',
    'Keep your knees tracking out over your toes and your chest up.',
    'Go down until your hip crease is level with your knee (or as deep as you can with a flat back).',
    'Drive through your whole foot and stand back up, breathing out at the top.'
  ],
  tips: [
    'Look straight ahead or slightly down, not up at the ceiling.',
    'Your knees moving forward past your toes is fine and normal - it depends on your leg lengths.',
    'Spend several sessions with just the bar. Depth and control come before weight.'
  ],
  safety: [
    'ALWAYS squat in a rack with the safety bars set. If you fail a rep, you simply sit down onto them and walk out.',
    'Never squat with the bar resting on your neck bones - it should sit on muscle.',
    'If your knees cave inward as you stand up, the weight is too heavy. Push them out.',
    'If your lower back rounds at the bottom (a "butt wink"), do not go that deep yet.',
    'Do not use a "bounce" out of the bottom with heavy weight until your technique is solid.',
    'Never walk the bar backwards out of a rack while turning around - always step back facing forward.'
  ],
  mistakes: [
    'Standing up with the hips first, leaving the chest folded over.',
    'Coming up onto the toes and letting the heels lift.',
    'Cutting the depth very short (quarter squats).'
  ]
},
{
  id: 'front-squat', name: 'Front Squat', cat: 'Legs', eq: 'Barbell',
  prim: ['Quads'], sec: ['Glutes', 'Abs', 'Upper Back'], mech: 'Compound', force: 'Squat', level: 'Advanced',
  desc: 'A squat with the bar resting across the front of your shoulders. Your torso stays much more upright, which hits the thighs harder and puts less strain on the lower back.',
  setup: ['Bar at upper-chest height in the rack, safeties set.'],
  steps: [
    'Rest the bar on the front of your shoulders, touching your collarbone.',
    'Cross your arms over the bar to hold it in place (easiest), or use the "clean grip" with fingers under the bar and elbows high.',
    'Drive your elbows up so your upper arms are parallel to the floor - this stops the bar rolling off.',
    'Stand up, step back, brace.',
    'Squat straight down keeping your torso as upright as possible.',
    'Drive up, keeping the elbows high all the way.'
  ],
  tips: ['If your elbows drop, the bar rolls forward and you will dump it. Keep them up.', 'You will use around 30% less weight than a back squat.'],
  safety: [
    'If you fail a rep, simply drop your elbows and let the bar roll forward off your shoulders onto the safeties. Practise this with an empty bar.',
    'This requires good wrist and shoulder flexibility. Use the cross-arm grip if the clean grip hurts your wrists.'
  ],
  mistakes: ['Letting the elbows drop.', 'Leaning forward like a back squat.']
},
{
  id: 'goblet-squat', name: 'Goblet Squat', cat: 'Legs', eq: 'Dumbbell',
  prim: ['Quads', 'Glutes'], sec: ['Abs', 'Upper Back'], mech: 'Compound', force: 'Squat', level: 'Beginner',
  desc: 'You hold a single dumbbell or kettlebell against your chest and squat. The weight in front acts as a counterbalance, which makes it much easier to squat deep with good form. This is the best squat to learn with.',
  setup: ['Pick one dumbbell. Hold it vertically, cupping the top head with both hands, against your chest.'],
  steps: ['Stand with feet shoulder width, toes slightly out.', 'Hold the weight at chest height with elbows pointing down.', 'Squat straight down, keeping your chest up and elbows inside your knees.', 'Go as deep as comfortable, then drive up through your whole foot.'],
  tips: ['At the bottom you can use your elbows to gently push your knees outward - a great way to learn proper knee position.', 'A perfect warm-up before barbell squats.'],
  safety: ['Very safe - if it gets too heavy you just set the dumbbell down in front of you.'],
  mistakes: ['Letting the weight drift away from the chest.', 'Heels lifting off the floor.']
},
{
  id: 'leg-press', name: 'Leg Press', cat: 'Legs', eq: 'Machine',
  prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Adductors'], mech: 'Compound', force: 'Squat', level: 'Beginner',
  desc: 'You sit in a machine and push a weighted platform away with your legs. It trains the same muscles as a squat with your back fully supported, so you can go heavy without balancing anything.',
  setup: ['Adjust the seat so that at the bottom of the movement your knees can reach about 90 degrees.', 'Load plates evenly on both sides.'],
  steps: [
    'Sit with your whole back and hips flat against the pad.',
    'Place your feet on the platform about shoulder width, mid-foot, toes slightly out.',
    'Push the platform up and release the safety handles.',
    'Lower the platform slowly by bending your knees until they reach about 90 degrees.',
    'Push back up through your whole foot until your legs are almost straight.',
    'Re-engage the safety handles before you get out.'
  ],
  tips: [
    'Feet higher on the platform = more glutes and hamstrings. Feet lower = more thighs.',
    'It is easy to load this machine very heavy. Add weight gradually - your joints adapt slower than your ego.'
  ],
  safety: [
    'NEVER lock your knees out hard and fast at the top. That is the classic leg press injury. Stop just short of straight.',
    'Do not let your lower back curl up off the pad at the bottom. If your hips lift, you are going too deep - reduce the range.',
    'Never put your hands on your knees to push. Hold the handles at the sides.',
    'Always set the safety catches before getting in.'
  ],
  mistakes: ['Going so deep the lower back rounds.', 'Bouncing at the bottom.', 'Knees caving inward.']
},
{
  id: 'hack-squat', name: 'Hack Squat Machine', cat: 'Legs', eq: 'Machine',
  prim: ['Quads'], sec: ['Glutes'], mech: 'Compound', force: 'Squat', level: 'Beginner',
  desc: 'A machine squat where your back is supported on an angled pad. It hits the thighs hard while taking the balance and lower-back demand out of squatting.',
  setup: ['Set the shoulder pads to your height and load the plates evenly.'],
  steps: ['Stand on the platform with feet shoulder width, back flat against the pad.', 'Release the safety handles.', 'Lower yourself by bending your knees until your thighs are around parallel.', 'Push back up without locking the knees hard.', 'Re-engage the safeties at the top when you are done.'],
  tips: ['Feet lower on the platform hits the thighs more; higher hits the glutes more.'],
  safety: ['Do not let your lower back peel off the pad at the bottom.', 'Set the safeties before you start so you can always bail.'],
  mistakes: ['Bouncing out of the bottom.', 'Knees caving in.']
},
{
  id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', cat: 'Legs', eq: 'Dumbbell', uni: true, paired: true,
  prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Abs'], mech: 'Compound', force: 'Squat', level: 'Intermediate',
  desc: 'A one-leg squat with your back foot raised on a bench. Brutally effective for the thighs and glutes, it fixes side-to-side imbalances, and it needs far less weight than a normal squat.',
  setup: ['Stand about a stride in front of a bench. Rest the top of your back foot on it.', 'Start with bodyweight only until you find your balance.'],
  steps: [
    'With your back foot on the bench, hop your front foot forward until your front shin will be vertical at the bottom.',
    'Hold a dumbbell in each hand at your sides (or none to start).',
    'Keep your chest up and lower straight down by bending your front knee.',
    'Go down until your back knee is close to the floor and your front thigh is about parallel.',
    'Push through your front foot to stand back up. Do all reps, then swap legs.'
  ],
  tips: ['If your front knee feels strained, move your front foot further forward.', 'Leaning your torso forward slightly targets the glutes more; staying upright targets the thighs.'],
  safety: ['Get your balance sorted with bodyweight before adding dumbbells.', 'Do not let your back knee slam into the floor.', 'If your rear foot ankle is uncomfortable, rest the ball of the foot on the bench instead of the top of the foot.'],
  mistakes: ['Standing too close to the bench, which crushes the front knee.', 'Letting the front knee cave inward.']
},
{
  id: 'walking-lunge', name: 'Walking Lunge', cat: 'Legs', eq: 'Dumbbell', paired: true,
  prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Abs'], mech: 'Compound', force: 'Squat', level: 'Beginner',
  desc: 'You step forward into a lunge and continue walking, alternating legs. Builds the thighs and glutes while training balance and coordination.',
  setup: ['A clear walkway. Dumbbells at your sides, or no weight to start.'],
  steps: ['Stand tall, then take a long step forward with one leg.', 'Lower straight down until your back knee is just above the floor and your front thigh is parallel.', 'Push through your front foot and bring your back leg through into the next step.', 'Keep alternating.'],
  tips: ['Longer steps hit the glutes more; shorter steps hit the thighs more.'],
  safety: ['Do not let your front knee crash inward.', 'Keep your torso upright - leaning forward with heavy dumbbells strains the lower back.'],
  mistakes: ['Steps too short, so the knee travels far past the toes.', 'Dropping the back knee onto the floor hard.']
},
{
  id: 'leg-extension', name: 'Leg Extension', cat: 'Legs', eq: 'Machine',
  prim: ['Quads'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A seated machine where you straighten your legs against a padded bar. It is the only exercise that isolates the thighs completely, which makes it great for warming up the knees and for finishing off leg day.',
  setup: ['Adjust the seat back so your knees line up with the machine pivot.', 'Set the ankle pad so it rests just above your foot, on the lower shin.'],
  steps: ['Sit back with your knees bent over the edge of the seat.', 'Hold the handles at your sides.', 'Straighten your legs until they are fully extended.', 'Squeeze your thighs for a second, then lower slowly.'],
  tips: ['A one-second pause at the top makes lighter weight much more effective.'],
  safety: [
    'Avoid very heavy weight with a fast, snapping lockout - this position puts a lot of shear force on the knee.',
    'If you have had knee problems, use moderate weight and a slightly shorter range (do not go to the deepest bend).'
  ],
  mistakes: ['Swinging the weight up with momentum and lifting off the seat.']
},
{
  id: 'leg-curl-lying', name: 'Lying Leg Curl', cat: 'Legs', eq: 'Machine',
  prim: ['Hamstrings'], sec: ['Calves'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'You lie face-down and curl your heels toward your backside against a pad. This directly trains the hamstrings - the muscles on the back of your thighs - which balances out all the squatting and protects your knees.',
  setup: ['Adjust so your knees sit just off the edge of the pad and the ankle roller rests on your Achilles, just above the heel.'],
  steps: ['Lie face-down and grip the handles.', 'Curl your heels up toward your backside as far as they will go.', 'Squeeze for a second at the top.', 'Lower slowly until your legs are almost straight.'],
  tips: ['Pointing your toes toward your shins (flexed feet) usually gives a stronger hamstring contraction.'],
  safety: ['Do not lift your hips off the pad to help - that arches the lower back under load.', 'Do not let the weight snap your knees straight at the bottom.'],
  mistakes: ['Hips rising off the bench.', 'Half reps.']
},
{
  id: 'leg-curl-seated', name: 'Seated Leg Curl', cat: 'Legs', eq: 'Machine',
  prim: ['Hamstrings'], sec: ['Calves'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'A hamstring curl done seated with your hips bent. Because the hips are flexed, the hamstrings are already stretched, which research suggests makes this version especially good for growth.',
  setup: ['Set the back pad so your knees line up with the pivot, and lock the thigh pad down snugly.'],
  steps: ['Sit back with your legs straight out and the roller behind your ankles.', 'Curl your heels down and back underneath the seat.', 'Squeeze, then return slowly to straight legs.'],
  tips: ['Sit tall against the back pad rather than slouching.'],
  safety: ['Make sure the thigh pad is locked before you start, or your legs will lift out of position.'],
  mistakes: ['Not securing the thigh pad.']
},
{
  id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', cat: 'Legs', eq: 'Barbell',
  prim: ['Hamstrings', 'Glutes'], sec: ['Lower Back', 'Forearms'], mech: 'Compound', force: 'Hinge', level: 'Intermediate',
  desc: 'Starting from standing, you push your hips back and lower the bar down your legs with nearly straight legs, then stand back up. The best exercise for building the hamstrings and glutes, and it teaches the hip hinge you need for deadlifts.',
  setup: ['Take the bar out of a rack at hip height (do not deadlift it off the floor).'],
  steps: [
    'Stand tall holding the bar against your thighs, feet hip width.',
    'Soften your knees slightly and lock that bend - your knees do not move again.',
    'Push your hips straight back as if you are closing a car door with your backside.',
    'Let the bar slide down your thighs, staying in contact with your legs.',
    'Keep going until you feel a strong stretch in your hamstrings - usually around mid-shin. Your back stays flat.',
    'Drive your hips forward and squeeze your glutes to stand back up.'
  ],
  tips: [
    'It is a hip movement, not a knee or back movement. The stretch you feel tells you it is right.',
    'The bar must stay close to your legs the whole time.',
    'Depth is decided by your hamstring flexibility, not by touching the floor.'
  ],
  safety: [
    'Stop lowering the moment your back starts to round. Going lower does nothing extra and risks your spine.',
    'Do not lock your knees completely straight - that puts the strain on the knee joint and lower back.',
    'Start light. Sore hamstrings after your first RDL session are normal and can be severe.'
  ],
  mistakes: ['Squatting down instead of hinging back.', 'Letting the bar drift forward away from the legs.', 'Rounding the upper back.']
},
{
  id: 'dumbbell-rdl', name: 'Dumbbell Romanian Deadlift', cat: 'Legs', eq: 'Dumbbell', paired: true,
  prim: ['Hamstrings', 'Glutes'], sec: ['Lower Back'], mech: 'Compound', force: 'Hinge', level: 'Beginner',
  desc: 'The Romanian deadlift with a dumbbell in each hand. Easier to learn than the barbell version and a good place to start with hip hinging.',
  setup: ['A moderate pair of dumbbells, held in front of your thighs.'],
  steps: ['Stand tall, knees softly bent, dumbbells in front of your thighs.', 'Push your hips back and lower the dumbbells down the front of your legs.', 'Stop when you feel a strong hamstring stretch and your back is still flat.', 'Drive your hips forward to stand tall and squeeze your glutes.'],
  tips: ['Keep the dumbbells brushing your legs on the way down.'],
  safety: ['Same rule as the barbell version: back rounds, set stops.'],
  mistakes: ['Letting the dumbbells swing out in front.']
},
{
  id: 'hip-thrust', name: 'Barbell Hip Thrust', cat: 'Legs', eq: 'Barbell',
  prim: ['Glutes'], sec: ['Hamstrings', 'Quads'], mech: 'Compound', force: 'Hinge', level: 'Intermediate',
  desc: 'With your upper back on a bench and a bar across your hips, you drive your hips up to full extension. The most direct and heaviest glute exercise there is.',
  setup: ['Sit on the floor with a bench behind you, its edge just under your shoulder blades.', 'Roll a loaded bar over your legs until it sits in your hip crease. ALWAYS use a thick pad or a folded towel under the bar.'],
  steps: [
    'Sit with your upper back against the bench edge and the padded bar across your hips.',
    'Set your feet flat, about shoulder width, so that at the top your shins are vertical.',
    'Tuck your chin slightly and keep your ribs down.',
    'Drive through your heels and push your hips straight up until your body is flat from knees to shoulders.',
    'Squeeze your glutes hard for a second at the top.',
    'Lower under control until the plates almost touch the floor.'
  ],
  tips: ['At the top your knees, hips and shoulders should form a straight line - do not push higher by arching your back.', 'Keep your eyes on a point that stays in front of you the whole rep; that stops you over-arching your neck.'],
  safety: [
    'Always use a barbell pad. Without it a loaded bar on the hip bones is genuinely painful and can bruise badly.',
    'Do not hyperextend your lower back at the top. The movement comes from the hips, not the spine.',
    'Roll the bar on and off your hips carefully - do not drop it on yourself.'
  ],
  mistakes: ['Arching the lower back instead of squeezing the glutes.', 'Feet too far forward, which turns it into a hamstring exercise.']
},
{
  id: 'glute-bridge', name: 'Glute Bridge', cat: 'Legs', eq: 'Bodyweight', bw: true,
  prim: ['Glutes'], sec: ['Hamstrings'], mech: 'Isolation', force: 'Hinge', level: 'Beginner',
  desc: 'Lying on the floor with knees bent, you push your hips up. A simple, safe glute exercise you can do anywhere, and a good warm-up before squats and deadlifts.',
  setup: ['Lie on your back with knees bent and feet flat, close to your backside.'],
  steps: ['Push through your heels and lift your hips until your body forms a straight line from knees to shoulders.', 'Squeeze your glutes hard for two seconds.', 'Lower slowly.'],
  tips: ['Rest a dumbbell or plate on your hips to add weight.'],
  safety: ['Push with your glutes, not by arching your lower back.'],
  mistakes: ['Pushing through the toes instead of the heels.']
},
{
  id: 'hip-abduction-machine', name: 'Hip Abduction Machine', cat: 'Legs', eq: 'Machine',
  prim: ['Abductors', 'Glutes'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A seated machine where you push your knees apart against pads. Works the side glutes and outer hips, which help stabilise your knees when you squat and run.',
  setup: ['Set the starting width so your knees begin close together but not painfully so.'],
  steps: ['Sit with your back on the pad and knees against the pads.', 'Push your knees apart as far as comfortable.', 'Squeeze for a second, then return slowly.'],
  tips: ['Leaning forward slightly targets the upper glute more.'],
  safety: ['Set the starting position sensibly - starting too narrow overstretches the hip.'],
  mistakes: ['Letting the weight slam the knees back together.']
},
{
  id: 'hip-adduction-machine', name: 'Hip Adduction Machine', cat: 'Legs', eq: 'Machine',
  prim: ['Adductors'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'The opposite machine - you squeeze your knees together against the pads. Trains the inner thighs, which are heavily involved in squatting and sumo deadlifting.',
  setup: ['Set the starting spread so you feel a mild stretch, not a strain.'],
  steps: ['Sit back with your legs on the outside of the pads.', 'Squeeze your knees together.', 'Hold for a second, then let them open slowly.'],
  tips: ['Strong adductors help protect against groin strains in sport.'],
  safety: ['Do not set the starting spread so wide that it forces a deep stretch under load - groin strains happen that way.'],
  mistakes: ['Using a very wide start position with heavy weight.']
},
{
  id: 'standing-calf-raise', name: 'Standing Calf Raise', cat: 'Legs', eq: 'Machine',
  prim: ['Calves'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'You rise up onto your toes against resistance. Trains the large upper calf muscle. Can be done on a machine, in a Smith machine, or holding dumbbells on a step.',
  setup: ['Set the shoulder pads so you can stand with a slight bend needed to get under them.', 'Place the balls of your feet on the edge of the platform with your heels hanging off.'],
  steps: ['Stand up to take the weight, legs straight but knees not locked hard.', 'Let your heels drop as low as they will go for a full stretch.', 'Push up onto your toes as high as possible.', 'Squeeze at the top for a second, then lower slowly.'],
  tips: ['Calves respond well to a slow lowering phase and a hard squeeze. Do not bounce.', '10-20 reps works well.'],
  safety: ['Do not bounce out of the bottom stretch - the Achilles tendon does not like fast, loaded bouncing.'],
  mistakes: ['Tiny bouncing reps with no stretch and no squeeze.']
},
{
  id: 'seated-calf-raise', name: 'Seated Calf Raise', cat: 'Legs', eq: 'Machine',
  prim: ['Calves'], sec: [], mech: 'Isolation', force: 'Push', level: 'Beginner',
  desc: 'A calf raise done seated with the weight on your knees. Bending the knee targets the deeper calf muscle (soleus), which the standing version misses.',
  setup: ['Adjust the knee pad so it sits firmly on your lower thighs with the balls of your feet on the platform.'],
  steps: ['Release the safety lever.', 'Drop your heels for a full stretch.', 'Push up onto your toes and squeeze.', 'Lower slowly.'],
  tips: ['Do both standing and seated versions - they hit different muscles.'],
  safety: ['Keep the knee pad snug but not crushing. Release the safety catch fully before starting.'],
  mistakes: ['Very short, fast reps.']
},
{
  id: 'nordic-curl', name: 'Nordic Hamstring Curl', cat: 'Legs', eq: 'Bodyweight', bw: true,
  prim: ['Hamstrings'], sec: ['Glutes', 'Abs'], mech: 'Isolation', force: 'Pull', level: 'Advanced',
  desc: 'Kneeling with your ankles held down, you lower your body forward as slowly as you can. Extremely effective at building hamstring strength and strongly protective against hamstring tears.',
  setup: ['Kneel on a pad with a partner holding your ankles, or hook your heels under a heavy loaded barbell or a lat pulldown thigh pad.'],
  steps: ['Kneel upright with your body straight from knees to head.', 'Lower yourself forward as slowly as you possibly can, resisting with your hamstrings.', 'Catch yourself with your hands when you can no longer hold.', 'Push back up with your hands and use your hamstrings to help return.'],
  tips: ['Everyone catches themselves at first. Getting a little lower each week is the progress.'],
  safety: ['Always have your hands ready to catch you.', 'Expect serious muscle soreness for a few days after your first session. Start with 2-3 reps only.'],
  mistakes: ['Bending at the hips instead of keeping a straight line.', 'Doing too many reps the first time.']
},
{
  id: 'step-up', name: 'Dumbbell Step-Up', cat: 'Legs', eq: 'Dumbbell', paired: true, uni: true,
  prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Calves'], mech: 'Compound', force: 'Squat', level: 'Beginner',
  desc: 'You step up onto a box or bench one leg at a time. Simple, joint-friendly, and it exposes strength differences between legs.',
  setup: ['Use a sturdy box or bench at roughly knee height. Lower is easier.'],
  steps: ['Stand facing the box with a dumbbell in each hand.', 'Place one whole foot flat on the box.', 'Push through that foot to stand up on the box - do not push off the back foot.', 'Step back down under control with the same leg leading.', 'Do all reps on one side, then swap.'],
  tips: ['The lower leg should do all the work. If you have to hop off the back foot, the box is too high.'],
  safety: ['Make sure the box is stable and will not slide.', 'Step down under control rather than jumping off.'],
  mistakes: ['Pushing off the trailing foot.', 'Box too high for your current strength.']
},

/* ========================== CORE ========================== */
{
  id: 'plank', name: 'Plank', cat: 'Core', eq: 'Bodyweight', bw: true,
  prim: ['Abs'], sec: ['Obliques', 'Glutes', 'Shoulders'], mech: 'Isolation', force: 'Static', level: 'Beginner',
  desc: 'You hold your body in a straight line on your forearms and toes. Trains the abs to do their real job - keeping your spine stable - which protects your back on every other lift.',
  setup: ['A mat on the floor. Log time in the reps field (e.g. 45 = 45 seconds).'],
  steps: ['Lie face down and prop yourself on your forearms, elbows under your shoulders.', 'Lift your hips so your body is one straight line from head to heels.', 'Squeeze your abs and glutes hard.', 'Breathe normally and hold.'],
  tips: ['Quality beats duration. A hard 30-second plank beats a sloppy 3-minute one.', 'Tuck your hips slightly under (posterior tilt) to make it much harder and much more effective.'],
  safety: ['If your lower back starts to ache, your hips have dropped. End the set.'],
  mistakes: ['Hips sagging toward the floor.', 'Hips piked up in the air.', 'Holding your breath.']
},
{
  id: 'hanging-leg-raise', name: 'Hanging Leg Raise', cat: 'Core', eq: 'Bodyweight', bw: true,
  prim: ['Abs'], sec: ['Obliques', 'Forearms'], mech: 'Isolation', force: 'Pull', level: 'Intermediate',
  desc: 'Hanging from a bar, you raise your legs up in front of you. One of the hardest and most effective ab exercises, and it builds grip at the same time.',
  setup: ['A pull-up bar. Use elbow supports (a captain\'s chair) if hanging is too hard on your grip.'],
  steps: ['Hang from the bar with straight arms.', 'Without swinging, curl your pelvis up and raise your knees toward your chest.', 'For the harder version, keep your legs straight and raise them until they are parallel to the floor.', 'Lower slowly and under control.'],
  tips: ['The key is curling your pelvis up at the top, not just lifting your legs.', 'Start with bent knees and progress to straight legs.'],
  safety: ['Do not swing. If you are swinging back and forth, the exercise is doing nothing and your shoulders are taking the strain.'],
  mistakes: ['Using momentum.', 'Only lifting the legs without moving the pelvis.']
},
{
  id: 'cable-crunch', name: 'Cable Crunch', cat: 'Core', eq: 'Cable',
  prim: ['Abs'], sec: ['Obliques'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Kneeling at a high cable, you crunch your torso down against the weight. Because you can add weight, it is the best way to actually build the abs rather than just endure them.',
  setup: ['Attach a rope to a high pulley. Kneel a step back from the machine.'],
  steps: ['Hold the rope beside your head or at your forehead.', 'Keeping your hips still, crunch down by rounding your spine and bringing your elbows toward your thighs.', 'Squeeze your abs hard at the bottom.', 'Return slowly under control.'],
  tips: ['The movement is a spinal curl, not a hip bend. Your hips should barely move.'],
  safety: ['Do not pull with your arms or you will strain your neck. Your hands only hold the rope in place.'],
  mistakes: ['Bending at the hips instead of curling the spine.', 'Yanking the rope with the arms.']
},
{
  id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', cat: 'Core', eq: 'Other', bw: true,
  prim: ['Abs'], sec: ['Lats', 'Shoulders', 'Obliques'], mech: 'Compound', force: 'Static', level: 'Advanced',
  desc: 'Kneeling, you roll a wheel out in front of you and pull it back. It trains the abs to resist your back arching under load - which is exactly what they need to do during heavy lifts.',
  setup: ['An ab wheel and a pad for your knees. Start close to a wall so the wheel stops before you overreach.'],
  steps: ['Kneel with the wheel under your shoulders.', 'Tuck your hips under and brace your abs hard.', 'Roll the wheel forward slowly, keeping your back flat - never letting it arch.', 'Go only as far as you can control, then pull back using your abs.'],
  tips: ['Start with a very short range. Add a few centimetres each week.'],
  safety: [
    'Your lower back must not sag or arch. If it does, you have gone too far - that is where back injuries happen with this exercise.',
    'Do not attempt standing rollouts until kneeling ones are easy.'
  ],
  mistakes: ['Rolling out too far too soon.', 'Letting the hips sag.']
},
{
  id: 'russian-twist', name: 'Russian Twist', cat: 'Core', eq: 'Plate',
  prim: ['Obliques'], sec: ['Abs'], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'Sitting with your feet off the floor, you rotate a weight side to side. Trains the obliques - the muscles along the sides of your midsection.',
  setup: ['Sit on the floor holding a light plate or dumbbell.'],
  steps: ['Sit with knees bent and lean back to about 45 degrees, keeping your back straight.', 'Lift your feet slightly if you can.', 'Rotate your torso to touch the weight to the floor beside one hip.', 'Rotate to the other side. That is one rep.'],
  tips: ['Rotate from your ribcage, not just by swinging your arms.'],
  safety: ['Keep your back straight, not rounded. Rounding and twisting under load is a poor combination for the lower back.', 'Go light and slow.'],
  mistakes: ['Just swinging the arms while the torso stays still.']
},
{
  id: 'dead-bug', name: 'Dead Bug', cat: 'Core', eq: 'Bodyweight', bw: true,
  prim: ['Abs'], sec: ['Obliques'], mech: 'Isolation', force: 'Static', level: 'Beginner',
  desc: 'Lying on your back, you extend the opposite arm and leg while keeping your lower back pressed to the floor. Safe, simple, and excellent for learning to brace your core properly.',
  setup: ['Lie on your back with arms pointing at the ceiling and knees bent at 90 degrees above your hips.'],
  steps: ['Press your lower back flat into the floor and keep it there.', 'Slowly lower your right arm overhead and straighten your left leg toward the floor.', 'Stop before your back lifts off the floor.', 'Return and repeat on the other side.'],
  tips: ['Slow is the point. Move as if the floor is fragile.'],
  safety: ['If your lower back arches away from the floor, reduce the range. That is the whole exercise.'],
  mistakes: ['Moving fast and letting the back arch.']
},
{
  id: 'side-plank', name: 'Side Plank', cat: 'Core', eq: 'Bodyweight', bw: true,
  prim: ['Obliques'], sec: ['Abs', 'Glutes', 'Shoulders'], mech: 'Isolation', force: 'Static', level: 'Beginner',
  desc: 'You hold your body sideways on one forearm. Trains the obliques and the muscles that stop your torso collapsing sideways. Log seconds in the reps field.',
  setup: ['Lie on your side with your elbow directly under your shoulder.'],
  steps: ['Stack your feet and lift your hips so your body is a straight line.', 'Squeeze your glutes and hold.', 'Swap sides.'],
  tips: ['Drop to your bottom knee to make it easier.'],
  safety: ['Keep your elbow directly under your shoulder to protect the joint.'],
  mistakes: ['Hips dropping toward the floor.']
},
{
  id: 'pallof-press', name: 'Pallof Press', cat: 'Core', eq: 'Cable',
  prim: ['Obliques', 'Abs'], sec: ['Shoulders'], mech: 'Isolation', force: 'Static', level: 'Beginner',
  desc: 'Standing side-on to a cable, you press a handle straight out while the cable tries to twist you. You resist the twist. Excellent, very safe core training that carries over to every other lift.',
  setup: ['Set a cable at chest height with a single handle. Stand side-on, a couple of steps away.'],
  steps: ['Hold the handle with both hands at your chest.', 'Brace your core and squeeze your glutes.', 'Press your hands straight out in front of your chest.', 'Resist the cable pulling you into a twist. Hold for 2-3 seconds.', 'Bring your hands back to your chest. Finish all reps, then turn around.'],
  tips: ['The further you stand from the machine, the harder it gets.'],
  safety: ['Very safe. Just do not let the cable snap your torso around at the end of the set.'],
  mistakes: ['Letting the torso rotate toward the machine.']
},
{
  id: 'crunch', name: 'Crunch', cat: 'Core', eq: 'Bodyweight', bw: true,
  prim: ['Abs'], sec: [], mech: 'Isolation', force: 'Pull', level: 'Beginner',
  desc: 'The basic ab exercise - lying on your back you curl your shoulders off the floor. Simple and effective for the upper abs.',
  setup: ['Lie on your back, knees bent, feet flat.'],
  steps: ['Place your hands lightly beside your head or crossed on your chest.', 'Curl your shoulders and upper back off the floor by squeezing your abs.', 'Pause at the top, then lower slowly.'],
  tips: ['Only your shoulder blades need to leave the floor. A full sit-up mostly uses the hip flexors.'],
  safety: ['Do not pull on your head or neck with your hands. Keep a fist-sized gap under your chin.'],
  mistakes: ['Yanking the head forward.', 'Bouncing off the floor.']
},

/* ========================== FULL BODY / OLYMPIC ========================== */
{
  id: 'kettlebell-swing', name: 'Kettlebell Swing', cat: 'Full Body', eq: 'Kettlebell',
  prim: ['Glutes', 'Hamstrings'], sec: ['Lower Back', 'Abs', 'Shoulders'], mech: 'Compound', force: 'Hinge', level: 'Intermediate',
  desc: 'You swing a kettlebell between your legs and snap your hips forward to launch it up to chest height. It builds explosive hip power and gets your heart rate up fast - part strength, part conditioning.',
  setup: ['One kettlebell placed about a foot in front of you. Clear space behind you.'],
  steps: [
    'Stand with feet slightly wider than shoulder width.',
    'Hinge at the hips, reach forward and tip the kettlebell toward you.',
    'Hike it back between your legs like a rugby pass, keeping your back flat.',
    'Snap your hips forward hard and squeeze your glutes - the bell floats up on its own.',
    'Let it swing to about chest height. Do not lift it with your arms.',
    'Let it fall back down, hinge again, and repeat.'
  ],
  tips: ['This is a hip snap, not a squat and not a front raise. Your arms are just ropes.', 'Stand tall and hard at the top - like a plank standing up.'],
  safety: [
    'It is a hip hinge, not a squat. Squatting the swing puts the load on your lower back.',
    'Do not let it pull you forward at the bottom - keep your weight in your heels.',
    'Make sure nobody is standing in front of or behind you.',
    'Learn the hip hinge with Romanian deadlifts before you swing.'
  ],
  mistakes: ['Squatting instead of hinging.', 'Lifting with the arms and shoulders.', 'Rounding the back at the bottom.']
},
{
  id: 'power-clean', name: 'Power Clean', cat: 'Full Body', eq: 'Barbell',
  prim: ['Full Body'], sec: ['Traps', 'Glutes', 'Hamstrings', 'Quads', 'Shoulders'], mech: 'Compound', force: 'Pull', level: 'Advanced',
  desc: 'You pull a barbell explosively from the floor and catch it on your shoulders. Builds full-body explosive power. It is technically demanding - worth coaching if you can get it.',
  setup: ['Bumper plates and a platform if possible, so you can drop the bar safely.'],
  steps: [
    'Set up as for a deadlift, with a slightly wider grip.',
    'Lift the bar off the floor smoothly, keeping it close to your legs.',
    'As it passes your knees, drive your hips forward violently and shrug - jump the bar upward.',
    'Pull yourself under the bar and catch it on the front of your shoulders with your elbows high, absorbing in a quarter squat.',
    'Stand up. Lower the bar to your thighs and back to the floor, or drop it if using bumper plates.'
  ],
  tips: ['Learn the movement with a broomstick or empty bar first. Speed comes before weight here.'],
  safety: [
    'Get coaching if you can. This is the most technical lift in a normal gym.',
    'Never try to save a bad catch - dump the bar forward and step back.',
    'Only drop bars if they are bumper plates on a proper platform.'
  ],
  mistakes: ['Pulling with the arms too early.', 'Catching with low elbows, which stresses the wrists.']
},
{
  id: 'thruster', name: 'Thruster', cat: 'Full Body', eq: 'Barbell',
  prim: ['Quads', 'Shoulders'], sec: ['Glutes', 'Triceps', 'Abs'], mech: 'Compound', force: 'Push', level: 'Advanced',
  desc: 'A front squat that flows straight into an overhead press. Works nearly everything and is extremely demanding on your conditioning.',
  setup: ['Bar racked on the front of your shoulders, elbows high.'],
  steps: ['Front squat down to depth.', 'Drive up out of the bottom explosively.', 'Use that momentum to press the bar overhead in one continuous motion.', 'Lower the bar back to your shoulders and go straight into the next squat.'],
  tips: ['Keep your elbows high through the squat.'],
  safety: ['Very fatiguing - form degrades fast. Stop the set when your technique slips, not when you fail.', 'Work in a rack or with bumper plates so you can bail safely.'],
  mistakes: ['Pausing between the squat and the press instead of flowing.']
},
{
  id: 'burpee', name: 'Burpee', cat: 'Full Body', eq: 'Bodyweight', bw: true,
  prim: ['Full Body'], sec: ['Chest', 'Quads', 'Abs', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'You drop to the floor, do a push-up, jump back to your feet and jump up. A full-body conditioning exercise that needs no equipment. Log reps or time.',
  setup: ['Clear floor space.'],
  steps: ['From standing, squat down and place your hands on the floor.', 'Jump or step your feet back into a push-up position.', 'Do a push-up (optional).', 'Jump or step your feet back under you.', 'Stand and jump with your hands overhead.'],
  tips: ['Step back and forward instead of jumping to make it lower impact.'],
  safety: ['Keep your back flat when you kick your feet back - do not let the hips slam down.', 'Land softly on the balls of your feet with soft knees.'],
  mistakes: ['Letting the hips sag in the push-up position when tired.']
},
{
  id: 'sled-push', name: 'Sled Push', cat: 'Full Body', eq: 'Sled',
  prim: ['Quads', 'Glutes'], sec: ['Calves', 'Abs', 'Shoulders'], mech: 'Compound', force: 'Push', level: 'Beginner',
  desc: 'You push a weighted sled across the floor. Brutal for conditioning and leg strength, but with almost no muscle damage or soreness because there is no lowering phase.',
  setup: ['Load the sled and clear a lane.'],
  steps: ['Grip the high or low handles and lean forward into the sled.', 'Keep your arms straight and your back flat.', 'Drive with short, powerful steps.'],
  tips: ['Low handles and a big lean = more leg drive. High handles = more upright and more running-like.'],
  safety: ['Watch behind you when you turn around.', 'Do not let your back round when leaning into the low handles.'],
  mistakes: ['Standing too upright to push heavy loads.']
},

/* ========================== CARDIO ========================== */
{
  id: 'treadmill', name: 'Treadmill (Walk / Run)', cat: 'Cardio', eq: 'Cardio Machine',
  prim: ['Cardio'], sec: ['Quads', 'Calves', 'Hamstrings'], mech: 'Compound', force: 'Cardio', level: 'Beginner',
  desc: 'Walking or running on a treadmill. Log minutes in the reps field and speed or incline in the weight field if you want to track progress.',
  setup: ['Clip the safety key to your clothing before you start.'],
  steps: ['Start at a walking pace and increase gradually.', 'Stand tall, look forward, do not hold the handrails while running.', 'Slow down gradually at the end rather than stepping off at speed.'],
  tips: ['A 10-12% incline walk at 5-6 km/h is a very effective low-impact fat-burning option.'],
  safety: ['Always attach the safety clip.', 'Never jump onto a fast-moving belt.'],
  mistakes: ['Hanging onto the handrails at a steep incline, which removes most of the work.']
},
{
  id: 'stationary-bike', name: 'Stationary Bike', cat: 'Cardio', eq: 'Cardio Machine',
  prim: ['Cardio'], sec: ['Quads', 'Hamstrings', 'Calves'], mech: 'Compound', force: 'Cardio', level: 'Beginner',
  desc: 'Low-impact cardio that is easy on the joints. Good for warming up, for recovery days, and for interval training.',
  setup: ['Set the seat height so your knee has a slight bend when the pedal is at its lowest point.'],
  steps: ['Adjust the seat, then start pedalling at an easy resistance.', 'Increase resistance or pace as you warm up.'],
  tips: ['Log minutes in the reps field and resistance level in the weight field.'],
  safety: ['A seat that is too low is the main cause of knee pain on a bike. Take the time to set it.'],
  mistakes: ['Seat set too low.']
},
{
  id: 'rowing-machine', name: 'Rowing Machine', cat: 'Cardio', eq: 'Cardio Machine',
  prim: ['Cardio', 'Upper Back'], sec: ['Lats', 'Quads', 'Glutes', 'Biceps'], mech: 'Compound', force: 'Cardio', level: 'Beginner',
  desc: 'Full-body cardio that also works the back and legs. Technique matters more than most people realise.',
  setup: ['Strap your feet in with the strap across the widest part of your foot.'],
  steps: ['Start compressed with shins vertical and arms straight.', 'Push hard with your LEGS first.', 'Then swing your torso back slightly.', 'Then pull the handle to your lower ribs with your arms.', 'Reverse the order to return: arms, then body, then legs.'],
  tips: ['The order is legs-body-arms out, arms-body-legs back. Say it to yourself while you row.'],
  safety: ['Do not round your back and yank with your arms - that is how people tweak their back on a rower.'],
  mistakes: ['Pulling with the arms first.', 'Rounding the lower back at the front of the stroke.']
},
{
  id: 'jump-rope', name: 'Jump Rope', cat: 'Cardio', eq: 'Other', bw: true,
  prim: ['Cardio', 'Calves'], sec: ['Shoulders', 'Forearms'], mech: 'Compound', force: 'Cardio', level: 'Beginner',
  desc: 'Skipping. Cheap, portable, and excellent for conditioning, calves and coordination. Log seconds or reps.',
  setup: ['Rope length: stand on the middle - the handles should reach your armpits.'],
  steps: ['Turn the rope with your wrists, not your whole arms.', 'Jump just high enough to clear it, landing softly on the balls of your feet.', 'Keep your elbows close to your sides.'],
  tips: ['Start with 30-second sets. It is more tiring than it looks.'],
  safety: ['Land softly. Repeated hard landings on a concrete floor are rough on the shins and knees - use a mat or wooden floor.'],
  mistakes: ['Jumping far too high.', 'Swinging with the whole arm.']
},
{
  id: 'stair-climber', name: 'Stair Climber', cat: 'Cardio', eq: 'Cardio Machine',
  prim: ['Cardio', 'Glutes'], sec: ['Quads', 'Calves'], mech: 'Compound', force: 'Cardio', level: 'Beginner',
  desc: 'Continuous stair climbing. Hits the glutes and legs harder than most cardio while staying low impact.',
  setup: ['Start on a low level and increase as you warm up.'],
  steps: ['Stand tall, take full steps, and let your heel touch each step.', 'Use the rails for balance only, not to hold yourself up.'],
  tips: ['Log minutes in reps and the level in weight.'],
  safety: ['Do not lean your whole bodyweight on the rails - it removes the work and strains the shoulders.'],
  mistakes: ['Taking tiny fast steps on your toes.']
}
];
