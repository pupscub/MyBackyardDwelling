import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { setupSupabase } from '@/setup-supabase';
import { Terminal, CheckCircle2, XCircle, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogMessage {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function SupabaseSetup() {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [manualSqlCommands, setManualSqlCommands] = useState<{tableSQL: string, rlsSQL: string}>({
    tableSQL: '',
    rlsSQL: ''
  });

  // Create a custom console logger to capture the output
  const setupLogCapture = () => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      originalConsoleLog(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      // Store SQL commands if present
      if (message.includes('CREATE TABLE property_submissions')) {
        setManualSqlCommands(prev => ({...prev, tableSQL: message}));
      } else if (message.includes('CREATE POLICY')) {
        setManualSqlCommands(prev => ({...prev, rlsSQL: message}));
      }
      
      setLogs(prev => [...prev, { message, type: 'info' }]);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { message, type: 'error' }]);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { message, type: 'warning' }]);
    };

    // Return function to restore console
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  };

  const runSetup = async () => {
    setLogs([]);
    setIsRunning(true);
    setIsComplete(false);
    setIsSuccess(false);
    
    // Set up log capture
    const restoreConsole = setupLogCapture();
    
    try {
      // Add initial log
      setLogs([{ message: "Starting Supabase setup...", type: 'info' }]);
      
      // Run setup
      const result = await setupSupabase();
      
      // Add final log
      setLogs(prev => [...prev, { 
        message: "Setup process finished", 
        type: result?.includes('failed') ? 'error' : 'success' 
      }]);
      
      setIsSuccess(!result?.includes('failed'));
    } catch (error) {
      setLogs(prev => [...prev, { 
        message: `Setup failed with error: ${error instanceof Error ? error.message : String(error)}`, 
        type: 'error' 
      }]);
      setIsSuccess(false);
    } finally {
      // Restore console
      restoreConsole();
      setIsRunning(false);
      setIsComplete(true);
    }
  };

  // Function to copy SQL to clipboard
  const copySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
  };
  
  // Find if any error happened
  const hasErrors = logs.some(log => log.type === 'error' || log.message.includes('❌'));
  
  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Setup Wizard</CardTitle>
          <CardDescription>
            Automatically create the necessary database tables and security policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            {!isRunning && !isComplete && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>One-click Database Setup</AlertTitle>
                <AlertDescription>
                  This wizard will attempt to create your Supabase database tables and security policies.
                  If you encounter any issues, you'll be provided with SQL commands to run manually.
                </AlertDescription>
              </Alert>
            )}
            
            {isComplete && isSuccess && (
              <Alert className="bg-green-50 border-green-200 mb-6">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Setup Successful!</AlertTitle>
                <AlertDescription>
                  Your Supabase database is now configured. You can try submitting a property analysis request.
                </AlertDescription>
              </Alert>
            )}
            
            {isComplete && !isSuccess && (
              <Alert variant="destructive" className="mb-6">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Setup Incomplete</AlertTitle>
                <AlertDescription>
                  Some steps could not be completed automatically. Please follow the manual instructions below.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {isComplete && !isSuccess && manualSqlCommands.tableSQL && (
            <div className="space-y-6 mb-8">
              <h3 className="text-lg font-semibold">Manual SQL Setup Required</h3>
              <p className="text-sm text-gray-500">
                Please run these SQL commands in your Supabase SQL Editor:{' '}
                <a 
                  href="https://app.supabase.com/project/_/sql/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  Open SQL Editor
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </p>
              
              {manualSqlCommands.tableSQL && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                    <span>1. Create property_submissions Table</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copySql(manualSqlCommands.tableSQL)}
                      className="h-8 flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
                    <code>{manualSqlCommands.tableSQL}</code>
                  </pre>
                </div>
              )}
              
              {manualSqlCommands.rlsSQL && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                    <span>2. Set Up Row Level Security</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copySql(manualSqlCommands.rlsSQL)}
                      className="h-8 flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
                    <code>{manualSqlCommands.rlsSQL}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
          
          <div className="border rounded-md bg-black text-white font-mono text-sm">
            <div className="bg-gray-800 px-4 py-2 text-gray-200 flex justify-between items-center">
              <span>Setup Log</span>
              {isRunning && <span className="animate-pulse">Running setup...</span>}
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-1">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet. Click "Run Setup" to begin.</div>
              ) : (
                logs.map((log, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      log.type === 'error' && "text-red-400",
                      log.type === 'warning' && "text-yellow-400",
                      log.type === 'success' && "text-green-400",
                      log.message.includes('✅') && "text-green-400",
                      log.message.includes('❌') && "text-red-400",
                      log.message.includes('⚠️') && "text-yellow-400",
                      log.message.includes('🚀') && "text-blue-400",
                      log.message.includes('🎉') && "text-green-400 font-bold"
                    )}
                  >
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">
              Return to Home
            </Link>
          </Button>
          <div className="space-x-2">
            {isComplete && !isSuccess && (
              <Button variant="secondary" asChild>
                <Link to="/supabase-test">
                  Run Diagnostics
                </Link>
              </Button>
            )}
            <Button onClick={runSetup} disabled={isRunning}>
              {isRunning ? 'Setting Up...' : isComplete ? 'Run Setup Again' : 'Run Setup'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 