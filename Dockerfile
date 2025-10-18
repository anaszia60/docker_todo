# Use an official lightweight Nginx web server image
FROM nginx:alpine

# Copy frontend files into Nginx's default web folder
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx when container runs
CMD ["nginx", "-g", "daemon off;"]

