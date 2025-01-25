export interface TeamMember {
  id: number;
  name: string;
  role: string;
  responsibility: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Nadeem",
    role: "Full Stack Developer", 
    responsibility: "User CRUD Operations",
    social: {
      github: "https://github.com/nadheemhassim",
      linkedin: "https://linkedin.com/in/nadeem",
      email: "nadeem@example.com"
    }
  },
  {
    id: 2,
    name: "Nihidu",
    role: "Frontend Developer",
    responsibility: "Room CRUD Operations",
    social: {
      github: "https://github.com/Weragod",
      email: "nihidu@example.com"
    }
  },
  {
    id: 3,
    name: "Selith",
    role: "Backend Developer",
    responsibility: "Booking CRUD Operations",
    social: {
      github: "https://github.com/selith",
      linkedin: "https://linkedin.com/in/selith"
    }
  },
  {
    id: 4,
    name: "Sadali",
    role: "UI/UX Developer",
    responsibility: "Review CRUD Operations",
    social: {
      github: "https://github.com/sandali205",
      email: "sadali@example.com"
    }
  },
  {
    id: 5,
    name: "Sandumini",
    role: "Full Stack Developer",
    responsibility: "Amenity CRUD Operations",
    social: {
      github: "https://github.com/SanduminiAvishka",
      linkedin: "https://linkedin.com/in/sandumini"
    }
  },
  {
    id: 6,
    name: "Thiranya",
    role: "Backend Developer",
    responsibility: "Payment CRUD Operations",
    social: {
      github: "https://github.com/Thiranya24",
      email: "hiranya@example.com"
    }
  },
  {
    id: 7,
    name: "Hirushi",
    role: "Frontend Developer",
    responsibility: "Offer CRUD Operations",
    social: {
      github: "https://github.com/HirushiR",
      linkedin: "https://linkedin.com/in/hirushi"
    }
  },
  {
    id: 8,
    name: "Sithara",
    role: "Full Stack Developer",
    responsibility: "Service CRUD Operations",
    social: {
      github: "https://github.com/SHettiarachchi",
      email: "sithara@example.com"
    }
  }
];