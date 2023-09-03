# Use an official Python runtime as the parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /api

# Copy the requirements.txt only to leverage Docker cache
COPY requirements.txt ./ 

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Copy the current directory contents into the container
COPY . ./

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define an environment variable
# This variable will be used by Flask as the port to run on
ENV PORT 5000

# Run app.py when the container launches
CMD ["python", "__init__.py"]
