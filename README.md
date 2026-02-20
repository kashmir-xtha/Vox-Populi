# Vox-Populi: Online voting system
**Hosted at:**  [vox-populi-eta.vercel.app](https://vox-populi-eta.vercel.app)
<img width="1863" height="867" alt="Screenshot 2026-02-13 211510" src="https://github.com/user-attachments/assets/89c76a5e-b27c-4ab3-b005-eaf6ad4a364f" />

The Online Voting System is a secure and efficient digital platform designed to facilitate fair and transparent elections within an organization or college community. Voters can cast their ballots electronically, view candidate information, and see real-time results while administrators can manage positions, approve candidates, and monitor election activities.

## Key Features:
1. Secure Authentication: Role-based login system for voters, candidates, and administrators
2. Candidate Applications: Users can apply for candidacy with photo and statements
3. Admin Approval System: Administrators review and approve/reject candidate applications
4. Voter Dashboard: Clean interface for viewing candidates by position and casting votes
5. One Voter, One Vote: Prevents double voting through database constraints
6. Real-time Results: Live vote counting and result visualization
7. Position Management: Admins can create and manage election positions
8. Responsive Design: Seamless experience across desktop, tablet, and mobile devices

## Tech Stack:
* Framework: Flask (Python)
* Database: PostgreSQL
* Authentication: bcrypt for password hashing
* API: RESTful endpoints with JSON responses
* Frontend: React/Vite
* Styling: Tailwind CSS
* Icons: Lucide React

## System Requirements:
- **Python**: v3.8 or above
- **PostgreSQL**: v12 or above
- **pip**: Python package manager
- **Git**: For cloning the repository
- **Node.js**: v18 or above

## Installation & Setup Guide
**Clone the repository**
```bash
git clone [https://github.com/kashmir-xtha/Vox-Populi]
cd Vox-Populi
```

### To run the backend system locally:

1. **Install dependencies**
```bash
pip install -r requirements.txt
```
   
3. **Initialize database**
```bash
py backend/init_db.py
```
4. **Run backend**
```bash
py backend/app.py
```

### To run the frontend system locally:
1. **Install dependencies**
```bash
npm install
```
3. **Run the local frontend server**
```bash
cd frontend
npm run dev
```
4. **Access the Application**
```bash
http://localhost:5173/
```


