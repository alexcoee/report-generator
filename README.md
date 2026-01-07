<div align="center">

# Retail Store Management System

### A complete platform for smart management of retail operations

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

[Features](#-features) • [Installation](#-quick-installation) • [Technologies](#-technologies) • [Documentation](#-documentation)

</div>

---

## Overview

This web system was developed to streamline daily operations in retail stores.  
The project was created while I was learning and working as a junior developer, with the goal of speeding up and simplifying internal processes at **Company**.

It provides tools to manage sales data, staff, reports, and operational routines, and was also used to compare data provided by stores with data collected by the camera monitoring team.

## Features

<table>
<tr>
<td width="50%">

### Executive Dashboard
- Real-time metrics
- Performance indicators
- Comparative charts
- Custom filters

</td>
<td width="50%">

### Store Management
- Full store registration
- Status control
- Detailed information
- Change history

</td>
</tr>
<tr>
<td width="50%">

### Sales Team Control
- Staff management
- Performance tracking
- Check-in / check-out records
- Active / inactive status

</td>
<td width="50%">

### Management Reports
- Automatic PDF generation
- Excel export
- Smart data processing
- Sales analysis

</td>
</tr>
<tr>
<td width="50%"></td>
<td width="50%">

### Task Management System
- Task creation
- Status tracking
- Tags and categorization
- Full follow-up

</td>
</tr>
</table>

## Quick Installation

# Clone the repository
git clone (clone this repository)

# Enter the directory
cd (path where you saved it)

# Install dependencies
npm install

# Start the server
npm start

Access: http://localhost:5000

### First Access

Username: admin  
Password: admin  

Security: Change the default password immediately after the first login.

## Technologies

<div align="center">

| Category | Technologies |
|--------|--------------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL, SQLite |
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Security | bcrypt, JWT, Helmet, Express-Session |
| Documents | PDFKit, ExcelJS |
| Integration | Google Drive API, Multer |

</div>

## Project Structure

retail-management-system/
├── server.js
├── package.json
├── .env.example
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   └── services/
├── public/
│   ├── css/
│   └── js/
├── views/
└── data/

## Configuration

### Environment Variables

Create a .env file based on .env.example:

PORT=5000  
NODE_ENV=production  
SESSION_SECRET=your-secret-key  
JWT_SECRET=your-jwt-key  

### Database

The system supports PostgreSQL and SQLite.

- PostgreSQL: Automatic configuration via environment variables  
- SQLite: Local fallback for development  

### Optional Features

Google Drive Backup  
OAuth 2.0 credentials can be configured for automatic cloud backups.

DVR/NVR Integration  
Support for Intelbras monitoring systems.

## Security

- Password hashing with bcrypt
- JWT authentication
- CSRF protection
- Rate limiting
- Helmet security headers
- Full action auditing
- Role-based access control

## Contributing

1. Fork the project  
2. Create a feature branch  
3. Commit your changes  
4. Push to the branch  
5. Open a Pull Request  

## License

This project was developed for learning and study purposes.

## Support

For technical support or questions:
- Check the documentation
- Review system logs
- Contact the administrator

---

<div align="center">

Built to improve retail operations while learning and growing as a junior developer

</div>
