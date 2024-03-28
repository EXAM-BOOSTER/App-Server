const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


const { adminLogin } = require('../controller/admin/login');
const { getStudentResources } = require('../controller/admin/student_resource');
const { getTeacherResources } = require('../controller/admin/teacher_resource');
const { getSubjects, getChaptersSubject , getChapters } = require('../controller/admin/subject_resource');
const { getSeries, getSeriesById, getSeriesSubject } = require('../controller/admin/series_resource');
const { getPYQ, getPYQSubject } = require('../controller/admin/pyq_resource');
const { getSubjectHistory, deleteSubjectHistory } = require('../controller/admin/subject_history');
const { getSeriesHistory, deleteSeriesHistory } = require('../controller/admin/test_series_history');
const { getPyqHistory, deletePyqHistory } = require('../controller/admin/pyq_history');
const { getPaymentHistory, deletePaymentHistory } = require('../controller/admin/payment_history');
const { getNotifications, deleteNotification } = require('../controller/admin/notification');
const { getMOTResources, deleteMOTResource } = require('../controller/admin/mot');


router.use(bodyParser.json());

router.post('/login', adminLogin);

router.use((req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
});
/* GET Resources */
router.get('/resources/student', getStudentResources);
router.get('/resources/teacher', getTeacherResources);
router.get('/resources/subjects', getSubjects);
router.get('/resources/subjects/:subjectId', getChapters);
router.get('/resources/subjects/:subjectId/:chapterId', getChaptersSubject);
router.get('/resources/series', getSeries);
router.get('/resources/series/:id', getSeriesById);
router.get('/resources/series/:seriesId/:testId', getSeriesSubject);
router.get('/resources/pyq', getPYQ);
router.get('/resources/pyq/:id', getPYQSubject);
router.get('/resources/subjects-history', getSubjectHistory);
router.get('/resources/series-history', getSeriesHistory);
router.get('/resources/pyq-history', getPyqHistory);
router.get('/resources/payment', getPaymentHistory);
router.get('/resources/notification', getNotifications);
router.get('/resources/mot', getMOTResources);




module.exports = router;