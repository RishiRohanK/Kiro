import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Ensure this API is always fresh and not cached by Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    // 1. Try to fetch from GitHub API first (Best for Production/Vercel)
    try {
        const githubRes = await fetch('https://api.github.com/repos/Redlix-Servers/Student_Forge_LMS/commits?per_page=5', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Student-Forge-LMS-Admin'
            },
            next: { revalidate: 0 }
        });

        if (githubRes.ok) {
            const data = await githubRes.json();
            const formatted = data.map((item: any) => ({
                sha: item.sha,
                commit: {
                    author: {
                        name: item.commit.author.name,
                        date: item.commit.author.date
                    },
                    message: item.commit.message
                },
                html_url: item.html_url
            }));
            return NextResponse.json(formatted);
        }
    } catch (githubError) {
        console.error('GitHub API error, falling back to local git...');
    }

    // 2. Fallback to local git log (Best for Local Development)
    try {
        const { stdout } = await execPromise('git log -n 5 --pretty=format:"%H#SEP#%an#SEP#%ad#SEP#%s"');
        
        if (stdout && stdout.trim() !== "") {
            const commits = stdout.trim().split('\n').filter(line => line.includes('#SEP#')).map(line => {
                const [sha, author, date, message] = line.split('#SEP#');
                return {
                    sha: sha,
                    commit: { author: { name: author, date: date }, message: message },
                    html_url: `https://github.com/Redlix-Servers/Student_Forge_LMS/commit/${sha}`
                };
            });
            return NextResponse.json(commits);
        }
    } catch (localError) {
        console.error('Local git error:', localError);
    }

    // 3. Last resort mock (so the UI never looks empty)
    return NextResponse.json([
        {
            sha: "0000000",
            commit: {
                author: { name: "System", date: new Date().toISOString() },
                message: "Deployment sync in progress..."
            },
            html_url: "#"
        }
    ]);
}
