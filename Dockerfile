# Use Playwright base image
FROM mcr.microsoft.com/playwright:v1.55.1-noble

# Set working directory
WORKDIR /usr/src/app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Install Playwright dependencies
RUN npx playwright install

# Default command to run tests
CMD ["npm", "run", "test"]