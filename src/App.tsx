
import AdminDashboard from '@/Admin/dashboard/page';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './SplashScreen';
import StudentPage from './Admin/student/page';
import TeacherPage from './Admin/teacher/page';
import DataPage from './Admin/data/page';
import SettingsPage from './Admin/settings/page';
import Dashboard from './Student/dashboard/page';
import LearningPath from './Student/learningpath/page';
import ResearchAsst from './Student/research/page';
import NotificationPage from './Student/notification/page';
import StudentSettings from './Student/settings/page';
import TeacherDashboard from './Teacher/dashboard/page';
import TeacherLearnPath from './Teacher/learningpath/page';
import TeacherResearchAsst from './Teacher/research/page';
import TeacherSettings from './Teacher/settings/page';
import ToolsPage from './Student/tools/page';
import McqGenerator from './Student/tools/allTools/mcqmaker/page';
import ResearchPaperGenerator from './Student/tools/allTools/aipapercreator/page';
import CreatePaper from './Student/tools/allTools/aipapercreator/prompt/page';
import PaperContent from './Student/tools/allTools/aipapercreator/prompt/paper';
import OnlineProctorTestPage from './Student/tools/allTools/onlineproctortest/page';
import ConferenceFinder from './Student/tools/allTools/conferencefinder/page';
import InterviewQuestionPage from './Student/tools/allTools/interviewquestion/page';

function App() {

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/Admin/dashboard/page" element={<AdminDashboard />} />
      <Route path="/Admin/student/page" element={<StudentPage />} />
      <Route path="/Admin/teacher/page" element={<TeacherPage />} />
      <Route path="/Admin/data/page" element={<DataPage/>} />
      <Route path="/Admin/settings/page" element={<SettingsPage/>} />
      <Route path="/Student/dashboard/page" element={<Dashboard />} />
      <Route path="/Student/learningpath/page" element={<LearningPath />} />
      <Route path="/Student/research/page" element={<ResearchAsst/>} />
      <Route path="/Student/notification/page" element={<NotificationPage/>} />
      <Route path="/Student/settings/page" element={<StudentSettings />} />
      <Route path="/Teacher/dashboard/page" element={<TeacherDashboard />} />
      <Route path="/Teacher/learningpath/page" element={<TeacherLearnPath/>} />
      <Route path="/Teacher/research/page" element={<TeacherResearchAsst />} />
      <Route path="/Teacher/Settings/page" element={<TeacherSettings />} />
      <Route path="/Student/tools/allTools/mcqmaker/page" element={<McqGenerator/>} />
      <Route path="/Student/tools/allTools/aipapercreator/page" element={<ResearchPaperGenerator/>} />
      <Route path="/Student/tools/allTools/aipapercreator/prompt/page" element={<CreatePaper/>} />
      <Route path="/Student/tools/allTools/aipapercreator/prompt/paper" element={<PaperContent/>} />
      <Route path="/Student/tools/allTools/onlineproctortest/page" element={<OnlineProctorTestPage/>} />
      <Route path="/Student/tools/allTools/conferencefinder/page" element={<ConferenceFinder/>} />
      <Route path="/Student/tools/allTools/interviewquestion/page" element={<InterviewQuestionPage/>} />
      <Route path="/Student/tools/page" element={<ToolsPage/>} />

      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App
