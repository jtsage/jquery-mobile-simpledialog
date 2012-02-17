#!/usr/bin/perl -w

$javapath = `which java`;
chomp $javapath;
$version = '';

$slugtext = "/*\n * jQuery Mobile Framework : plugin to provide a simple Dialog widget.\n * Copyright (c) JTSage\n * CC 3.0 Attribution.  May be relicensed without permission/notifcation.\n * https://github.com/jtsage/jquery-mobile-simpledialog\n */\n";

@files = (
	'jquery.mobile.simpledialog.min.js',
	'jquery.mobile.simpledialog2.min.js',
	'jquery.mobile.simpledialog.min.css');

if ( $javapath eq '' ) {
	die "Java not found, can not continue\n";
}

if ( $ARGV[0] ) {
	
	if ( $ARGV[0] eq 'clean' ) {
		print "Cleaning up old javascript files... ";
		foreach ( @files ) {
			unlink($_);
		}
		print "DONE.\n";
	}
	elsif ( $ARGV[0] eq 'all' ) {
		if ( defined($ARGV[1]) ) {
			$version = "-".$ARGV[1];
		}
		print "Making all usual variants... ($version)\n";
		make_master();
		$last = (stat "../js/jquery.mobile.simpledialog.js")[9];
		open OUTFILE, ">current_build.txt";
		print OUTFILE $last;
		close OUTFILE;
		print "BUILD FINISHED.\n";
	}
	elsif ( $ARGV[0] eq 'check' ) {
		$last = (stat "../js/jquery.mobile.simpledialog.js")[9];
		$lastmod = ( stat "current_build.txt" )[9];
		$allhere = 1;
		$allcurrent = 1;
		open INFILE, "<current_build.txt";
		@lines = <INFILE>;
		close INFILE;
		if ( $lines[0] != $last ) { 
			print "Built Scripts are OLD, run './make.pl all'\n";
		} else {
			foreach ( @files ) {
				if ( ! -e $_ ) { $allhere = 0; }
			}
			if ( !$allhere ) {
				print "Some Scripts are MISSING, run './make.pl all'\n"; 
			} else {
				foreach ( @files ) {
					$thismod = ( stat $_ )[9];
					if ( $thismod > $lastmod ) { $allcurrent = 0; }
				}
				if ( !$allcurrent ) {
					print "Some Scripts appear modified since last build, run ./make.pl all\n";
				} else {
					print "Build scripts appear to be CURRENT.\n";
				}
			}
		}
	}
	else {
		show_usage();
	}
	
} else {
	show_usage();
}

sub show_usage {
	print "\nDateBox Build Script\n";
	print "--------------------\n";
	print "Targets: (./make.pl <target>)\n";
	print " all   :-: Build all scripts\n";
	print " usage :-: Show this information\n";
	print " clean :-: Clean the build directory\n";
	print " check :-: Check build status of scripts\n\n";
}

sub do_slug {
	local @ARGV = ($_[0]);
	local $^I = '.bac';
	while(<>){
		if ($. == 1) {
			print "$slugtext$/";
			print;
		} else {
			print;
		}
	}
}

sub make_master {
	if ( $version ne '' ) {
		system("cp", "../js/jquery.mobile.simpledialog.js", "jquery.mobile.simpledialog".$version.".js");
		system("cp", "../js/jquery.mobile.simpledialog2.js", "jquery.mobile.simpledialog2".$version.".js");
		system("cp", "../css/jquery.mobile.simpledialog.css", "jquery.mobile.simpledialog".$version.".css");
	}
	print "Build :-: Compressed Script... ";
	print "compressing... ";
	system($javapath, "-jar", "../external/yuicompressor-2.4.6.jar", "-o", "./jquery.mobile.simpledialog".$version.".min.js", "../js/jquery.mobile.simpledialog.js");
	system($javapath, "-jar", "../external/yuicompressor-2.4.6.jar", "-o", "./jquery.mobile.simpledialog2".$version.".min.js", "../js/jquery.mobile.simpledialog2.js");
	print "DONE.\n";
	print "Build :-: CSS File... ";
	print "compressing... ";
	system($javapath, "-jar", "../external/yuicompressor-2.4.6.jar", "-o", "./jquery.mobile.simpledialog".$version.".min.css", "../css/jquery.mobile.simpledialog.css");
	do_slug("./jquery.mobile.simpledialog".$version.".min.js");
	do_slug("./jquery.mobile.simpledialog2".$version.".min.js");
	do_slug("./jquery.mobile.simpledialog".$version.".min.css");
	print "DONE.\n";
}


#			print 'Usage'; }
