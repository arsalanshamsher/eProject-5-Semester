const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

const exportWorkoutsCSV = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });

    const fields = ['name', 'category', 'sets', 'reps', 'weights', 'notes', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(workouts);

    res.header('Content-Type', 'text/csv');
    res.attachment('workouts.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'CSV export failed' });
  }
};

const exportNutritionPDF = async (req, res) => {
  try {
    const logs = await Nutrition.find({ user: req.user._id });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=nutrition.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Nutrition Logs', { align: 'center' });
    doc.moveDown();

    logs.forEach((log) => {
      doc.fontSize(14).text(`Meal: ${log.mealType} - ${log.date.toDateString()}`);
      log.entries.forEach((entry) => {
        doc.text(`• ${entry.food} - ${entry.quantity} - ${entry.calories} cal`);
      });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'PDF export failed' });
  }
};

module.exports = { exportWorkoutsCSV, exportNutritionPDF };
