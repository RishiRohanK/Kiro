import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET() {
    try {
        // Get the last 5 commits using git log
        // Using a more unique separator to avoid collisions
        const { stdout, stderr } = await execPromise('git log -n 5 --pretty=format:"%H#SEP#%an#SEP#%ad#SEP#%s"');
        
        if (stderr) {
            console.error('Git error output:', stderr);
        }

        if (!stdout || stdout.trim() === "") {
            return NextResponse.json([]);
        }

        const commits = stdout.trim().split('\n').filter(line => line.includes('#SEP#')).map(line => {
            const [sha, author, date, message] = line.split('#SEP#');
            return {
                sha: sha || "unknown",
                commit: {
                    author: {
                        name: author || "Anonymous",
                        date: date || new Date().toISOString()
                    },
                    message: message || "No commit message"
                },
                html_url: sha ? `https://github.com/Redlix-Servers/serversf/commit/${sha}` : "#"
            };
        });

        return NextResponse.json(commits);
    } catch (error) {
        console.error('Git log error:', error);
        return NextResponse.json([
            {
                sha: "0000000",
                commit: {
                    author: { name: "System", date: new Date().toISOString() },
                    message: "Manual deployment log (Git unavailable)"
                },
                html_url: "#"
            }
        ], { status: 500 });
    }
}
