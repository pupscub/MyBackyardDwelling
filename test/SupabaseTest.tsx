import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseSetup } from '@/lib/supabase-test';
import { Terminal, ExternalLink, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface TestResult {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  details?: string;
}

export default function SupabaseTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [manualSqlCommands, setManualSqlCommands] = useState<{
    execFunction: string;
    tableCreation: string;
    rlsPolicies: string;
  }>({
    execFunction: `-- Create the exec_sql function
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;`,
    tableCreation: `-- Create the property_submissions table
CREATE TABLE IF NOT EXISTS property_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  address TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  lot_size TEXT,
  zoning TEXT,
  allows_adu BOOLEAN DEFAULT true,
  max_adu_size TEXT,
  setback_front TEXT,
  setback_back TEXT,
  setback_sides TEXT,
  additional_notes TEXT[],
  satellite_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_submissions_updated_at
BEFORE UPDATE ON property_submissions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();`,
    rlsPolicies: `-- Enable RLS on the table
ALTER TABLE property_submissions ENABLE ROW LEVEL SECURITY;

-- Create insert policy for anonymous users
CREATE POLICY "Anyone can insert property submissions" 
ON property_submissions
FOR INSERT TO anon
WITH CHECK (true);

-- Create select policy for anonymous users
CREATE POLICY "Anyone can view property submissions by ID" 
ON property_submissions
FOR SELECT TO anon
USING (true);`
  });

  const runTests = async () => {
    setResults([]);
    setIsRunning(true);
    setIsDone(false);
    
    // Create a custom function to capture console outputs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    try {
      // Override console methods to capture outputs
      console.log = (...args) => {
        originalConsoleLog(...args);
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        setResults(prev => [...prev, { 
          message, 
          type: message.includes('✅') ? 'success' : 'info'
        }]);
      };
      
      console.error = (...args) => {
        originalConsoleError(...args);
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        setResults(prev => [...prev, { message, type: 'error' }]);
      };
      
      console.warn = (...args) => {
        originalConsoleWarn(...args);
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        setResults(prev => [...prev, { message, type: 'warning' }]);
      };
      
      // Run the tests
      await testSupabaseSetup();
      
    } catch (err) {
      setResults(prev => [...prev, { 
        message: `Test execution failed: ${err instanceof Error ? err.message : String(err)}`,
        type: 'error'
      }]);
    } finally {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      
      setIsRunning(false);
      setIsDone(true);
    }
  };
  
  // Function to copy SQL to clipboard
  const copySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
  };
  
  // Extract SQL commands that need to be run
  const analyzeResults = (): {
    needsExecFunction: boolean;
    needsTable: boolean;
    needsRls: boolean;
    hasFunctionPermissionIssue: boolean;
  } => {
    return {
      needsExecFunction: results.some(r => 
        r.message.includes("function \"exec_sql\" does not exist") ||
        r.message.includes("The exec_sql function doesn't exist")
      ),
      needsTable: results.some(r => 
        r.message.includes("The 'property_submissions' table doesn't exist") ||
        r.message.includes("relation \"property_submissions\" does not exist") ||
        r.message.includes("42P01")
      ),
      needsRls: results.some(r => 
        r.message.includes("Insert test failed") ||
        r.message.includes("permission denied") ||
        r.message.includes("42501")
      ),
      hasFunctionPermissionIssue: results.some(r =>
        r.message.includes("permission denied for") ||
        r.message.includes("must be owner of")
      )
    };
  };

  const issues = isDone ? analyzeResults() : { needsExecFunction: false, needsTable: false, needsRls: false, hasFunctionPermissionIssue: false };
  const hasAnyIssue = issues.needsExecFunction || issues.needsTable || issues.needsRls || issues.hasFunctionPermissionIssue;
  
  const getRecommendation = () => {
    if (issues.hasFunctionPermissionIssue) {
      return "You don't have permission to create SQL functions or tables with your current Supabase credentials. Please check that you're using admin credentials or contact your Supabase administrator.";
    }
    
    if (issues.needsExecFunction) {
      return "The exec_sql function is missing in your Supabase project. This function is needed for the setup wizard to work automatically.";
    }
    
    if (issues.needsTable) {
      return "The property_submissions table doesn't exist in your database. It needs to be created.";
    }
    
    if (issues.needsRls) {
      return "Row Level Security needs to be configured for the property_submissions table to allow form submissions.";
    }
    
    return "All tests passed! Your Supabase configuration is correctly set up.";
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Configuration Test</CardTitle>
          <CardDescription>
            Run diagnostics to identify and fix issues with your Supabase setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            {!isRunning && !isDone && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Run the tests</AlertTitle>
                <AlertDescription>
                  Click the button below to test your Supabase connection and configuration.
                  This will check if the database table exists and if security policies are properly set up.
                </AlertDescription>
              </Alert>
            )}
            
            {isDone && hasAnyIssue && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Required</AlertTitle>
                <AlertDescription>
                  {getRecommendation()}
                </AlertDescription>
              </Alert>
            )}
            
            {isDone && !hasAnyIssue && (
              <Alert variant="default" className="bg-green-50 border-green-200 mb-6">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your Supabase configuration looks good! You should be able to use the application now.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {isDone && hasAnyIssue && (
            <div className="mb-8 space-y-6">
              <h3 className="text-lg font-semibold">Required SQL Commands</h3>
              <p className="text-sm text-gray-500">
                Copy these commands and run them in your Supabase SQL Editor:{' '}
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
              
              {issues.needsExecFunction && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                    <span>1. Create the exec_sql Function</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copySql(manualSqlCommands.execFunction)}
                      className="h-8 flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
                    <code>{manualSqlCommands.execFunction}</code>
                  </pre>
                </div>
              )}
              
              {issues.needsTable && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                    <span>{issues.needsExecFunction ? "2" : "1"}. Create the property_submissions Table</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copySql(manualSqlCommands.tableCreation)}
                      className="h-8 flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
                    <code>{manualSqlCommands.tableCreation}</code>
                  </pre>
                </div>
              )}
              
              {(issues.needsRls || issues.needsTable) && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                    <span>
                      {issues.needsExecFunction && issues.needsTable ? "3" : 
                       issues.needsExecFunction || issues.needsTable ? "2" : "1"}. Set Up Row Level Security
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copySql(manualSqlCommands.rlsPolicies)}
                      className="h-8 flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
                    <code>{manualSqlCommands.rlsPolicies}</code>
                  </pre>
                </div>
              )}
              
              <div className="pt-4">
                <Alert>
                  <AlertTitle>Need more help?</AlertTitle>
                  <AlertDescription>
                    Check the <Link to="/supabase-setup" className="text-blue-600 hover:underline font-medium">Setup Wizard</Link> or 
                    refer to the <a href="/SUPABASE_SETUP_MANUAL.md" target="_blank" className="text-blue-600 hover:underline font-medium">manual setup guide</a> for 
                    step-by-step instructions.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
          
          <div className="border rounded-md bg-black text-white font-mono text-sm">
            <div className="bg-gray-800 px-4 py-2 text-gray-200 flex justify-between items-center">
              <span>Test Results</span>
              {isRunning && <span className="animate-pulse">Running tests...</span>}
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <div className="text-gray-400">No test results yet</div>
              ) : (
                results.map((result, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "whitespace-pre-wrap break-all",
                      result.type === 'error' && "text-red-400",
                      result.type === 'warning' && "text-yellow-400",
                      result.type === 'success' && "text-green-400",
                      result.type === 'info' && "text-blue-400",
                      result.message.startsWith("✅") && "text-green-400",
                      result.message.startsWith("❌") && "text-red-400",
                      result.message.startsWith("⚠️") && "text-yellow-400"
                    )}
                  >
                    {result.message}
                    {result.details && (
                      <div className="ml-4 mt-1 text-gray-400 text-xs">{result.details}</div>
                    )}
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
            <Button variant="secondary" asChild>
              <Link to="/supabase-setup">
                Setup Wizard
              </Link>
            </Button>
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? 'Running Tests...' : isDone ? 'Run Tests Again' : 'Run Tests'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 