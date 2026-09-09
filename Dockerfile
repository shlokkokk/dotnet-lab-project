# Multi-stage Dockerfile for All-in-One Full-Stack Deployment

# Stage 1: Build Frontend (Vite + React)
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build & Publish .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src
COPY DotNetServer/DotNetServer.csproj DotNetServer/
RUN dotnet restore DotNetServer/DotNetServer.csproj
COPY DotNetServer/ DotNetServer/
WORKDIR /src/DotNetServer
RUN dotnet publish -c Release -o /app/publish

# Copy frontend build output to wwwroot so ASP.NET Core serves both UI and API
COPY --from=frontend-build /app/dist /app/publish/wwwroot

# Stage 3: Final Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
ENV PORT=5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "DotNetServer.dll"]
