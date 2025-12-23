# Frontend Integration Guide

This guide provides examples of how to connect your React/Next.js frontend to the Express backend.

## 1. Using Fetch API

### Get All Projects
```javascript
const fetchProjects = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/projects');
    const result = await response.json();
    
    if (result.success) {
      return result.data; // Array of projects
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }
};
```

### Create Project (Authenticated)
Better Auth handles session automatically via cookies or headers. Assuming you use cookies:

```javascript
const createProject = async (projectData) => {
  try {
    const response = await fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating project:', error);
  }
};
```

## 2. Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true, // Important for Better Auth session cookies
});

export const getProjects = () => api.get('/projects').then(res => res.data);
export const createProject = (data) => api.post('/projects', data).then(res => res.data);
```

## 3. UI Implementation Example (React)

```jsx
import { useEffect, useState } from 'react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(res => {
        if (res.success) setProjects(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map(project => (
        <div key={project.id} className="border p-4 rounded-lg shadow-sm">
          <img src={project.primaryImage} alt={project.name} className="w-full h-48 object-cover rounded" />
          <h2 className="text-xl font-bold mt-2">{project.name}</h2>
          <div className="flex gap-2 mt-2">
            {project.techStacks.map(tech => (
              <span key={tech.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```
