# Project Positivamente

![logo](./src/assets/captures/logo.png "Logo positively")

### Developed for a foundation that provides humanitarian aid, managing volunteers, activities, conferences, etc...

### Because the foundation required to improve the management and control processes in their projects and conferences, as well as the volunteers who wish to participate, offering a pleasant experience during the management of the various modules that represent the system.

### The application was developed an Api Rest which is located in the following repository: [API REST](https://github.com/sourclab/ApiPositivamente)

---

## Functions

#### **All management functions have their main methods of Add, Delete, Display and Update**.

**Home pages**

- Home
- Volunteering
- About Us
- Contact Us
- News & Events
- Projects

**Administrators control panel**.

- Manage Workdays.
- Manage Projects.
- Manage News.
- Manage Users.
  - Volunteers
  - Managers
- General visualization of all registered activities
- Generation of reports by date in PDF format.
  - Projects
  - Workshops
  - Volunteers

* Database backup
* Database Restoration
* Download of user manual (administrator version)

**Users control panel**.

- Visualization of active workshops for participation
- Schedule of workshops
- User profile
- Download user manual (user version)

## Installation

1. Clone application repository

```bash
git clone https://github.com/sourclab/Positivamente.git
```

2. Clone Api repository (follow api installation instructions to continue)

```bash
git clone https://github.com/sourclab/ApiPositivamente.git
```

3. Updating libraries

```bash
npm install
```

4. Start application

```bash
npm run serve
```

### Note: The database has 3 predefined users: admin, manager and volunteer, the login data are as follows:

| Mail                      |  Password  |
| ------------------------- | :--------: |
| admin@admin.com           |   admin    |
| gestor@gestor.com         |   gestor   |
| voluntario@voluntario.com | voluntario |

---

## Screen Captures

![Login](./src/assets/captures/login.png "login")
![pass](./src/assets/captures/pass.png "pass")
![Home](./src/assets/captures/Screenshot_1.png "Home")
![Home](./src/assets/captures/Screenshot_2.png "Home")
![Home](./src/assets/captures/Screenshot_3.png "Home")
![Home](./src/assets/captures/Screenshot_4.png "Home")
![Home](./src/assets/captures/Screenshot_5.png "Home")
![Home](./src/assets/captures/Screenshot_6.png "Home")
![Dashboard](./src/assets/captures/ini.png "Dashboard")
![AddNews](./src/assets/captures/Screenshot_13.png "Añadir noticias")
![AddNews](./src/assets/captures/Screenshot_14.png "Display registered news")
![AddNews](./src/assets/captures/Screenshot_15.png "Display registered projects")
![AddNews](./src/assets/captures/Screenshot_16.png "New project")
![AddNews](./src/assets/captures/Screenshot_17.png "View logged journeys")
![AddNews](./src/assets/captures/Screenshot_18.png "New journey")
![AddNews](./src/assets/captures/Screenshot_19.png "User management")
![AddNews](./src/assets/captures/Screenshot_20.png "Schedule of activities")
![AddNews](./src/assets/captures/Screenshot_21.png "Generation of reports in PDF file")
![AddNews](./src/assets/captures/Screenshot_22.png "Generation of reports in PDF file projects")
![AddNews](./src/assets/captures/Screenshot_24.png "Generation of reports in PDF file volunteers")
![AddNews](./src/assets/captures/Screenshot_25.png "Administrator management")
![AddNews](./src/assets/captures/Screenshot_26.png "Administrator management")
![AddNews](./src/assets/captures/Screenshot_31.png "User profile")
![AddNews](./src/assets/captures/Screenshot_32.png "User profile")
![AddNews](./src/assets/captures/Screenshot_33.png "Display of days assigned to a user")
