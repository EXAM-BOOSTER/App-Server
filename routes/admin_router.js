const express = require('express');
const router = express.Router();

const { adminLogin } = require('../controller/admin/login');
const { getStudentResources,deleteUserResource } = require('../controller/admin/student_resource');
const { getTeacherResources,deleteTeacherResource } = require('../controller/admin/teacher_resource');
const { getSubjects, getChaptersSubject , getChapters, putChapters, putChaptersQuestions, deleteChapter } = require('../controller/admin/subject_resource');
const { getSeries, getSeriesById, getSeriesSubject, putSeries, putSeriesTest, putSeriesSubject,deleteSeries, deleteSeriesTest } = require('../controller/admin/series_resource');
const { getPYQ, getPYQSubject, putPYQ, putPYQSubject,deletePYQ } = require('../controller/admin/pyq_resource');
const { getSubjectHistory, deleteSubjectHistory } = require('../controller/admin/subject_history');
const { getSeriesHistory, deleteSeriesHistory } = require('../controller/admin/test_series_history');
const { getPyqHistory, deletePyqHistory } = require('../controller/admin/pyq_history');
const { getPaymentHistory, deletePaymentHistory } = require('../controller/admin/payment_history');
const { getNotifications,putNotification, deleteNotification } = require('../controller/admin/notification');
const { getMOTResources,putMOTResource, deleteMOTResource } = require('../controller/admin/mot');


router.post('/login', adminLogin);

router.use((req, res, next) => {
    // console.log(req.session)
    // if (req.session.admin) {
    //     next();
    // } else {
    //     res.status(401).json({ success: false, message: "Unauthorized" });
    // }
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    next();
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

/* POST Request for Resources Creation */
router.post('/resources/subjects/:subjectId', putChapters);
router.post('/resources/subjects/:subjectId/:chapterId', putChaptersQuestions);
router.post('/resources/series', putSeries);
router.post('/resources/series/:seriesId', putSeriesTest);
router.post('/resources/series/:seriesId/:testId', putSeriesSubject);
router.post('/resources/pyq', putPYQ);
router.post('/resources/pyq/:id', putPYQSubject);
router.post('/resources/notification', putNotification);
router.post('/resources/mot', putMOTResource);


/* POST Request for Resources Deletion */
router.post('/resources/delete/student/:id', deleteUserResource);
router.post('/resources/delete/teacher/:id', deleteTeacherResource);
router.post('/resources/delete/subjects/:subjectId/:chapterId', deleteChapter);
router.post('/resources/delete/series/:id', deleteSeries);
router.post('/resources/delete/series/:seriesId/:testId', deleteSeriesTest);
router.post('/resources/delete/pyq/:id', deletePYQ);
router.post('/resources/delete/subjects-history/:id', deleteSubjectHistory);
router.post('/resources/delete/series-history/:id', deleteSeriesHistory);
router.post('/resources/delete/pyq-history/:id', deletePyqHistory);
router.post('/resources/delete/payment/:id', deletePaymentHistory);
router.post('/resources/delete/notification/:id', deleteNotification);
router.post('/resources/delete/mot/:id', deleteMOTResource);

module.exports = router;