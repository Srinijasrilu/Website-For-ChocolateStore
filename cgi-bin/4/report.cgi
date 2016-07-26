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
my $database = "jadrn050";
my $username = "jadrn050";
my $password = "silver";
my $database_source = "dbi:mysql:$database:$host:$port";

	
my $dbh = DBI->connect($database_source, $username, $password) 	
or die 'Cannot connect to db';



my $sth = $dbh->prepare("SELECT sku, quantity,  date_of_order FROM sales order by sku");
$sth->execute();

$str = "";
while(my @row=$sth->fetchrow_array()) {
    foreach $item (@row) { 
        $str .= $item."|";
        }       
    $str .= ";";    
    }
 

print "Content-type:  text/html\n\n";
$sth->finish();
$dbh->disconnect();

    	
print $str;

    	

		
		
		
		
		
		


