# GitHub Repository Setup Guide

Follow these steps to push your MyBackyardDwelling project to GitHub:

## Create a GitHub Repository

1. **Log in** to your GitHub account at [github.com](https://github.com)
2. Click the **+** icon in the top right corner and select **New repository**
3. Enter a **Repository name**: `mybackyarddwelling` (or your preferred name)
4. Add an optional **Description**: "An ADU property analysis platform for evaluating backyard dwelling potential"
5. Select **Public** or **Private** depending on your preference
6. DO NOT initialize the repository with a README, .gitignore, or license since you've already created these locally
7. Click **Create repository**

## Connect Your Local Repository to GitHub

After creating the repository, you'll see instructions to push an existing repository from the command line. Follow these steps:

```bash
# Add the GitHub repository as the remote origin
git remote add origin https://github.com/YOUR_USERNAME/mybackyarddwelling.git

# Rename the main branch if it's not already called 'main'
# Only run this if your current branch is called 'master' instead of 'main'
git branch -M main

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Verify Your Repository

After pushing:

1. Refresh your GitHub repository page
2. You should see all your project files and commit history
3. Ensure that your `.gitignore` file is properly configured to exclude sensitive files
4. Check that your workflow file (`.github/workflows/ci-cd.yml`) is visible in the repository

## Setting Up GitHub Pages (Optional)

If you choose to use GitHub Pages for frontend hosting:

1. Go to your repository settings
2. Scroll down to the "GitHub Pages" section
3. Under "Source", select the branch you want to deploy (usually `main`)
4. Set the directory to `/dist` (where your compiled frontend code is located)
5. Click "Save"

## Adding Collaborators (Optional)

If you're working with others:

1. Go to your repository settings
2. Select "Manage access" from the left sidebar
3. Click "Invite a collaborator"
4. Enter the GitHub username or email of your collaborator
5. Select their role (read, write, admin)
6. Send the invitation

## Next Steps

After setting up your GitHub repository:

1. Review the [DEPLOYMENT.md](DEPLOYMENT.md) file for hosting options
2. Configure any CI/CD settings in your repository
3. Add any necessary GitHub secrets for your deployment workflows
4. Consider setting up branch protection rules for your main branch if working in a team 