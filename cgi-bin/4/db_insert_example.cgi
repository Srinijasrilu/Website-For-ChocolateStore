#!/usr/bin/perl 
#	Sample perl cgi script.  This script inserts new data
#       into the jadrn000 database on opatija.
#	Code by Alan Riggins
#
   
use DBI;
use CGI;

my $q = new CGI;

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn000";
my $username = "jadrn000";
my $password = "apple";
my $database_source = "dbi:mysql:$database:$host:$port";

	
#my $dbh = DBI->connect($database_source, $username, $password) 
#or die 'Cannot connect to db';

print <<EOC;
Content-type:  text/html

<!DOCTYPE html>
<html>
<head>
	<title>A Database Insertion Example with Perl</title>
	<meta http-equiv="content-type" 
		content="text/html;charset=utf-8" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
        <style type="text/css">
            h1 { text-align: center; }
            table { width: 40%; margin: 0 auto 0 auto; border-collapse: collapse; }
            td { border: 1px solid blue; background-color: #DDD; }
        </style>

</head>
<body>
EOC
#### Parameters
my $name = $q->param('name');
my $address = $q->param('address');
my $city = $q->param('city');
my $state = $q->param('state');
my $zip = $q->param('zip');
my $age = $q->param('age');
my $fruit = join("||",$q->param('fruit'));
my $statement = 
    "INSERT INTO people VALUES('$name','$address','$city','$state','$zip','$age','$fruit');";
    
print "The SQL statement is:\n";
print "$statement\n";


#my $count = $dbh->do($statement);


print "<h1>Result of Insertion</h1>\n";
if($count == 1) {
    print "SUCCESS, the number of rows affected is $count\n";
    }
else {
#    print "ERROR: ".$dbh->errstr()."<br />\n";
#    print "ERROR: ".$dbh->state()."\n";    
    }
 
print "</body></html>";

#$dbh->disconnect();

    	



