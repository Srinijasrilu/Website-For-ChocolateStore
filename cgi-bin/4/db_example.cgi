#!/usr/bin/perl 
#	Sample perl cgi script.  This script prints a list of the 
#	products in the jadran 'products' table.
#
#	Code by Alan Riggins
#
   
use DBI;


my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn000";
my $username = "jadrn000";
my $password = "apple";
my $database_source = "dbi:mysql:$database:$host:$port";

	
my $dbh = DBI->connect($database_source, $username, $password) 
or die 'Cannot connect to db';

my $query = "SELECT name,address,city,state,zip from people "; 

            
my $sth = $dbh->prepare($query);
$sth->execute();

print <<EOC;
Content-type:  text/html

<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<title>A Database Query Example</title>
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
print "<h1>Content in Database</h1>\n";
print "\t<table>\n";
print "<tr><th>Name</th><th>Address</th><th>City</th><th>State</th><th>zip</th></tr>\n";
while(my @row=$sth->fetchrow_array()) {
    print "\t\t<tr>\n";
    foreach $item (@row) { 
        print "\t\t\t<td>$item</td>\n";
        }
    print "\t\t</tr>\n";         
    }
print "\t</table>\n"; 
print "</body></html>";
$sth->finish();
$dbh->disconnect();

    	



