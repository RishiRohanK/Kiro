"use client";

import { useState, useMemo, useRef } from "react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import { Search, Clock, Star, Users, ExternalLink, ShieldCheck } from "lucide-react";

// Master Brand & Tech Logomap
const techLogos: Record<string, string> = {
    "Amazon Web Services": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    "Google Cloud": "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "Cloudera": "https://www.cloudera.com/content/dam/www/marketing/images/logos/cloudera/cloudera-logo@2x.png",
    "Google": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    "IBM": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    "Meta": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    "Oracle": "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    "Cisco": "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    "Salesforce": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    "SAP": "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    "Red Hat": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Red_Hat_logo.svg",
    "Docker": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Docker_Logo.png",
    "Adobe": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Adobe_Corporate_logo.svg/960px-Adobe_Corporate_logo.svg.png",
    "CompTIA": "https://www.comptia.org/_next/image/?url=https%3A%2F%2Fimages4.cmp.optimizely.com%2Ff3a9e09e3e2c11efaf66baf966a02641&w=256&q=90",
    "VMware": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Vmware.svg",
    "MongoDB": "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
    "Great Learning": "https://upload.wikimedia.org/wikipedia/commons/2/20/Great_Learning_Logo.png",
    "Coursera": "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg",
    "freeCodeCamp": "https://upload.wikimedia.org/wikipedia/commons/3/39/FreeCodeCamp_logo.svg",
    "Codecademy": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Codecademy_logo.svg",
    "Alison": "https://upload.wikimedia.org/wikipedia/en/2/23/Alison_Learning_Logo.png",
    "Android Developers": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Android_logo_2023.svg",
    "Simplilearn": "https://upload.wikimedia.org/wikipedia/commons/2/20/Simplilearn_Logo.svg",
    "HashiCorp": "https://www.idmworks.com/wp-content/uploads/2025/02/HashiCorp-black-2.png",
    "Apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "Atlassian": "https://upload.wikimedia.org/wikipedia/commons/0/01/Atlassian_logo.svg",
    "Databricks": "https://justglobal.com/wp-content/uploads/2021/07/databricks-logo.png",
    "Snowflake": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg",
    "Linux Foundation": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Linux_Foundation_logo_2013.svg/1280px-Linux_Foundation_logo_2013.svg.png",
    "ConsenSys": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Consensys_logo_2023.svg/3840px-Consensys_logo_2023.svg.png",
    "Jira": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jira_Logo.svg/1280px-Jira_Logo.svg.png",
    "Unity Technologies": "https://upload.wikimedia.org/wikipedia/commons/1/19/Unity_Technologies_logo.svg",
    "Epic Games": "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg",
    "Elastic": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Elasticsearch_logo.svg",
    "Splunk": "https://upload.wikimedia.org/wikipedia/commons/2/24/Splunk_Logo.svg",
    "ServiceNow": "https://upload.wikimedia.org/wikipedia/commons/2/23/ServiceNow_logo.svg",
    "HubSpot": "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
    "ISACA": "https://upload.wikimedia.org/wikipedia/commons/a/a1/ISACA_logo.png",
    "PMI": "https://cdn.worldvectorlogo.com/logos/pmi-6.svg",
    "CloudBees": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Cloudbees-logo-black.png",
    "ISC2": "https://edge.sitecorecloud.io/internationf173-xmc4e73-prodbc0f-9660/media/Project/ISC2/Main/Media/logos/logo.svg?iar=0",
    "EC-Council": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Ec_Council_Logo.png",
    "Scrum Alliance": "https://ambassador-api.s3.amazonaws.com/uploads/portal/38139/2025_04_30_20_14_16_SAI_Logo_300dpi_Stacked_Full_Color.png",
    "Scrum": "https://ambassador-api.s3.amazonaws.com/uploads/portal/38139/2025_04_30_20_14_16_SAI_Logo_300dpi_Stacked_Full_Color.png",
    "Cloud Native Computing Foundation": "https://www.cncf.io/wp-content/uploads/2023/04/cncf-main-site-logo.svg",
    "CNCF": "https://www.cncf.io/wp-content/uploads/2023/04/cncf-main-site-logo.svg",
    "HTML": "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    "CSS": "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
    "JavaScript": "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
    "React": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "Node.js": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    "Python": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    "Java": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Java_Logo.svg",
    "C++": "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    "Swift": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg",
    "Kotlin": "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.svg",
    "SAS": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/SAS_logo_horiz.svg/1280px-SAS_logo_horiz.svg.png",
    "Juniper": "https://juniper-prod.scene7.com/is/image/junipernetworks/wordmark?fmt=png8-alpha&network=on&wid=320&dpr=off",
    "Fortinet": "https://www.fortinet.com/content/dam/fortinet/images/general/fortinet-logo.svg",
    "Ubuntu": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ubuntu-logo-2022.svg/1280px-Ubuntu-logo-2022.svg.png",
    "SUSE": "https://www.suse.com/assets/img/suse-white-logo-green.svg",
    "ISTQB": "https://istqb.org/wp-content/uploads/2025/06/logo-for-header.svg",
    "Selenium": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Selenium_logo.svg/1280px-Selenium_logo.svg.png",
    "IIBA": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI934USzkcwdIj0dx7rdPLIdeHfZneH83Qvw&s",
    "CryptoCurrency Certification": "https://cryptoconsortium.org/wp-content/uploads/2019/08/logo.png",
    "CryptoConsortium": "https://cryptoconsortium.org/wp-content/uploads/2019/08/logo.png",
    "PHP": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
    "Ruby": "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg",
    "Tableau": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tableau_Logo.png/960px-Tableau_Logo.png",
    "PeopleCert": "https://www.peoplecert.org/-/media/folders-reorganized/images/peoplecert-logos-2025/pc-logo-25th-ann-07022025.svg?h=76&iar=0&w=224&hash=8B693CD520BBE9B97054EF8DA380D2F0",
    "Go": "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
    "Rust": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg"
};

const certificates = [
    { title: "AWS Solutions Architect", provider: "Amazon Web Services", duration: "3-6 months", level: "Professional", rating: 4.8, students: "50K+", description: "Design and deploy scalable AWS solutions", link: "https://aws.amazon.com/certification/", tags: ["Cloud", "AWS", "Architecture"], category: "Cloud" },
    { title: "GCP Cloud Architect", provider: "Google Cloud", duration: "4-8 months", level: "Professional", rating: 4.7, students: "25K+", description: "Design and manage Google Cloud solutions", link: "https://cloud.google.com/certification/", tags: ["Cloud", "GCP", "Architecture"], category: "Cloud" },
    { title: "Azure Fundamentals", provider: "Microsoft", duration: "1-2 months", level: "Beginner", rating: 4.6, students: "100K+", description: "Learn Azure cloud services fundamentals", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["Cloud", "Azure", "Fundamentals"], category: "Cloud" },
    { title: "AWS Developer", provider: "Amazon Web Services", duration: "2-4 months", level: "Professional", rating: 4.7, students: "40K+", description: "Develop applications on AWS platform", link: "https://aws.amazon.com/certification/", tags: ["AWS", "Development", "Cloud"], category: "Cloud" },
    { title: "GCP Cloud Engineer", provider: "Google Cloud", duration: "2-3 months", level: "Intermediate", rating: 4.5, students: "30K+", description: "Deploy and manage Google Cloud solutions", link: "https://cloud.google.com/certification/", tags: ["GCP", "Engineering", "Cloud"], category: "Cloud" },
    { title: "Azure Administrator", provider: "Microsoft", duration: "3-4 months", level: "Intermediate", rating: 4.6, students: "35K+", description: "Manage Azure subscriptions and resources", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["Azure", "Administration", "Cloud"], category: "Cloud" },
    { title: "AWS SysOps Admin", provider: "Amazon Web Services", duration: "3-5 months", level: "Professional", rating: 4.5, students: "20K+", description: "Deploy and manage AWS systems", link: "https://aws.amazon.com/certification/", tags: ["AWS", "SysOps", "Administration"], category: "Cloud" },
    { title: "GCP DevOps Engineer", provider: "Google Cloud", duration: "4-6 months", level: "Advanced", rating: 4.8, students: "15K+", description: "Implement DevOps practices on GCP", link: "https://cloud.google.com/certification/", tags: ["GCP", "DevOps", "Engineering"], category: "Cloud" },
    { title: "Certified Kubernetes Admin", provider: "Cloud Native Computing Foundation", duration: "2-4 months", level: "Intermediate", rating: 4.9, students: "15K+", description: "Master Kubernetes cluster administration", link: "https://www.cncf.io/certification/cka/", tags: ["Kubernetes", "DevOps", "Containers"], category: "DevOps" },
    { title: "Docker Associate", provider: "Docker", duration: "1-3 months", level: "Intermediate", rating: 4.5, students: "30K+", description: "Containerization and Docker expertise", link: "https://www.docker.com/certification/", tags: ["Docker", "Containers", "DevOps"], category: "DevOps" },
    { title: "CKAD Certification", provider: "CNCF", duration: "2-3 months", level: "Intermediate", rating: 4.7, students: "12K+", description: "Develop applications for Kubernetes", link: "https://www.cncf.io/certification/ckad/", tags: ["Kubernetes", "Development", "Containers"], category: "DevOps" },
    { title: "Jenkins Engineer", provider: "CloudBees", duration: "1-2 months", level: "Intermediate", rating: 4.3, students: "8K+", description: "Master Jenkins CI/CD pipelines", link: "https://www.cloudbees.com/jenkins/certification", tags: ["Jenkins", "CI/CD", "DevOps"], category: "DevOps" },
    { title: "Terraform Associate", provider: "HashiCorp", duration: "2-3 months", level: "Intermediate", rating: 4.6, students: "18K+", description: "Infrastructure as Code with Terraform", link: "https://www.hashicorp.com/certification/terraform-associate", tags: ["Terraform", "IaC", "DevOps"], category: "DevOps" },
    { title: "Ansible Automation", provider: "Red Hat", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "10K+", description: "Automate IT infrastructure with Ansible", link: "https://www.redhat.com/en/services/certification", tags: ["Ansible", "Automation", "DevOps"], category: "DevOps" },
    { title: "Ethical Hacker (CEH)", provider: "EC-Council", duration: "3-6 months", level: "Advanced", rating: 4.4, students: "40K+", description: "Ethical hacking and penetration testing", link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/", tags: ["Security", "Ethical Hacking", "Penetration Testing"], category: "Cybersecurity" },
    { title: "CISSP", provider: "ISC2", duration: "6-12 months", level: "Advanced", rating: 4.7, students: "25K+", description: "Information Systems Security Professional", link: "https://www.isc2.org/Certifications/CISSP", tags: ["Security", "Risk Management", "Governance"], category: "Cybersecurity" },
    { title: "CompTIA Security+", provider: "CompTIA", duration: "2-4 months", level: "Intermediate", rating: 4.5, students: "60K+", description: "Foundation-level cybersecurity skills", link: "https://www.comptia.org/certifications/security", tags: ["Security", "CompTIA", "Fundamentals"], category: "Cybersecurity" },
    { title: "CISM Certification", provider: "ISACA", duration: "4-8 months", level: "Advanced", rating: 4.6, students: "15K+", description: "Certified Information Security Manager", link: "https://www.isaca.org/credentialing/cism", tags: ["Security", "Management", "Governance"], category: "Cybersecurity" },
    { title: "CISA Auditor", provider: "ISACA", duration: "4-8 months", level: "Advanced", rating: 4.5, students: "12K+", description: "Certified Information Systems Auditor", link: "https://www.isaca.org/credentialing/cisa", tags: ["Security", "Audit", "Risk"], category: "Cybersecurity" },
    { title: "Java Professional", provider: "Oracle", duration: "3-6 months", level: "Professional", rating: 4.6, students: "45K+", description: "Master Java programming language", link: "https://education.oracle.com/java", tags: ["Java", "Programming", "Oracle"], category: "Programming" },
    { title: "Azure Developer", provider: "Microsoft", duration: "3-5 months", level: "Professional", rating: 4.5, students: "28K+", description: "Develop solutions for Microsoft Azure", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["Azure", "Development", "Microsoft"], category: "Programming" },
    { title: "Python Institute PCAP", provider: "Python Institute", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "22K+", description: "Certified Associate Python Programmer", link: "https://pythoninstitute.org/pcap", tags: ["Python", "Programming", "Development"], category: "Programming" },
    { title: "React Dev", provider: "Meta", duration: "2-3 months", level: "Intermediate", rating: 4.3, students: "35K+", description: "Build modern web applications with React", link: "https://developers.facebook.com/developercircles/", tags: ["React", "JavaScript", "Frontend"], category: "Programming" },
    { title: "Node.js Application Developer", provider: "OpenJS Foundation", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "18K+", description: "Server-side JavaScript development", link: "https://openjsf.org/certification/", tags: ["Node.js", "JavaScript", "Backend"], category: "Programming" },
    { title: "Google Data Analytics", provider: "Google", duration: "3-6 months", level: "Beginner", rating: 4.7, students: "150K+", description: "Analyze data and gain insights", link: "https://grow.google/certificates/data-analytics/", tags: ["Data Analytics", "Google", "Business Intelligence"], category: "Data Science" },
    { title: "IBM Data Science", provider: "IBM", duration: "4-8 months", level: "Intermediate", rating: 4.5, students: "80K+", description: "Complete data science methodology", link: "https://www.ibm.com/training/badge/data-science-professional-certificate-v2", tags: ["Data Science", "IBM", "Machine Learning"], category: "Data Science" },
    { title: "Power BI Analyst", provider: "Microsoft", duration: "2-4 months", level: "Intermediate", rating: 4.6, students: "40K+", description: "Business intelligence and data visualization", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["Power BI", "Analytics", "Visualization"], category: "Data Science" },
    { title: "Tableau Specialist", provider: "Tableau", duration: "1-3 months", level: "Beginner", rating: 4.4, students: "25K+", description: "Data visualization with Tableau", link: "https://www.tableau.com/learn/certification", tags: ["Tableau", "Visualization", "Analytics"], category: "Data Science" },
    { title: "SAS Specialist", provider: "SAS", duration: "3-5 months", level: "Intermediate", rating: 4.3, students: "15K+", description: "Statistical analysis and data management", link: "https://www.sas.com/en_us/certification.html", tags: ["SAS", "Statistics", "Analytics"], category: "Data Science" },
    { title: "GCP ML Engineer", provider: "Google Cloud", duration: "4-8 months", level: "Advanced", rating: 4.8, students: "20K+", description: "Design and implement ML solutions", link: "https://cloud.google.com/certification/", tags: ["Machine Learning", "GCP", "AI"], category: "AI & ML" },
    { title: "AWS Machine Learning", provider: "Amazon Web Services", duration: "4-8 months", level: "Advanced", rating: 4.7, students: "18K+", description: "ML solutions on AWS platform", link: "https://aws.amazon.com/certification/", tags: ["Machine Learning", "AWS", "AI"], category: "AI & ML" },
    { title: "TensorFlow Dev", provider: "Google", duration: "2-4 months", level: "Intermediate", rating: 4.6, students: "30K+", description: "Build ML models with TensorFlow", link: "https://www.tensorflow.org/certificate", tags: ["TensorFlow", "Deep Learning", "AI"], category: "AI & ML" },
    { title: "Azure AI Engineer", provider: "Microsoft", duration: "3-5 months", level: "Professional", rating: 4.5, students: "12K+", description: "Design AI solutions on Azure", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["Azure", "AI", "Machine Learning"], category: "AI & ML" },
    { title: "Oracle DBA", provider: "Oracle", duration: "4-8 months", level: "Professional", rating: 4.6, students: "20K+", description: "Manage Oracle database systems", link: "https://education.oracle.com/database", tags: ["Oracle", "Database", "Administration"], category: "Database" },
    { title: "Microsoft SQL DBA", provider: "Microsoft", duration: "3-6 months", level: "Professional", rating: 4.4, students: "25K+", description: "SQL Server database administration", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["SQL Server", "Database", "Microsoft"], category: "Database" },
    { title: "MongoDB Developer", provider: "MongoDB", duration: "2-4 months", level: "Intermediate", rating: 4.5, students: "15K+", description: "NoSQL database development", link: "https://university.mongodb.com/certification", tags: ["MongoDB", "NoSQL", "Database"], category: "Database" },
    { title: "MySQL DBA", provider: "Oracle", duration: "2-4 months", level: "Intermediate", rating: 4.3, students: "18K+", description: "MySQL database management", link: "https://education.oracle.com/mysql", tags: ["MySQL", "Database", "Administration"], category: "Database" },
    { title: "PMP Certification", provider: "PMI", duration: "4-8 months", level: "Professional", rating: 4.7, students: "200K+", description: "Project Management Professional", link: "https://www.pmi.org/certifications/project-management-pmp", tags: ["Project Management", "PMI", "Leadership"], category: "Project Management" },
    { title: "Scrum Master", provider: "Scrum Alliance", duration: "1-2 months", level: "Intermediate", rating: 4.5, students: "80K+", description: "Agile project management with Scrum", link: "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster", tags: ["Scrum", "Agile", "Management"], category: "Project Management" },
    { title: "PRINCE2 Foundation", provider: "PeopleCert", duration: "2-3 months", level: "Beginner", rating: 4.4, students: "50K+", description: "Structured project management method", link: "https://www.axelos.com/certifications/prince2", tags: ["PRINCE2", "Project Management", "Methodology"], category: "Project Management" },
    { title: "Agile ACP", provider: "PMI", duration: "2-4 months", level: "Intermediate", rating: 4.6, students: "35K+", description: "Agile project management practices", link: "https://www.pmi.org/certifications/agile-acp", tags: ["Agile", "PMI", "Project Management"], category: "Project Management" },
    { title: "Google UX Design", provider: "Google", duration: "3-6 months", level: "Beginner", rating: 4.6, students: "120K+", description: "User experience design fundamentals", link: "https://grow.google/certificates/ux-design/", tags: ["UX Design", "Google", "Design"], category: "Design" },
    { title: "Adobe Expert", provider: "Adobe", duration: "2-4 months", level: "Professional", rating: 4.4, students: "30K+", description: "Master Adobe Creative Suite", link: "https://www.adobe.com/training/certification.html", tags: ["Adobe", "Design", "Creative"], category: "Design" },
    { title: "W3C Frontend", provider: "W3C", duration: "2-3 months", level: "Intermediate", rating: 4.3, students: "25K+", description: "Modern frontend web development", link: "https://www.w3.org/", tags: ["Frontend", "HTML", "CSS"], category: "Web Development" },
    { title: "Vue.js Developer", provider: "Vue School", duration: "1-3 months", level: "Intermediate", rating: 4.5, students: "15K+", description: "Progressive JavaScript framework", link: "https://vueschool.io/", tags: ["Vue.js", "JavaScript", "Frontend"], category: "Web Development" },
    { title: "Angular Developer", provider: "Google", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "20K+", description: "Build dynamic web applications", link: "https://developers.google.com/certification/", tags: ["Angular", "TypeScript", "Frontend"], category: "Web Development" },
    { title: "Android Developer", provider: "Google", duration: "3-6 months", level: "Intermediate", rating: 4.5, students: "40K+", description: "Build Android mobile applications", link: "https://developers.google.com/certification/", tags: ["Android", "Mobile", "Java"], category: "Mobile Development" },
    { title: "iOS Developer", provider: "Apple", duration: "3-6 months", level: "Intermediate", rating: 4.6, students: "30K+", description: "Develop apps for iOS platform", link: "https://developer.apple.com/certification/", tags: ["iOS", "Swift", "Mobile"], category: "Mobile Development" },
    { title: "React Native", provider: "Meta", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "25K+", description: "Cross-platform mobile development", link: "https://reactnative.dev/", tags: ["React Native", "Mobile", "JavaScript"], category: "Mobile Development" },
    { title: "Flutter Developer", provider: "Google", duration: "2-4 months", level: "Intermediate", rating: 4.5, students: "20K+", description: "Cross-platform app development", link: "https://flutter.dev/", tags: ["Flutter", "Dart", "Mobile"], category: "Mobile Development" },
    { title: "Cisco CCNA", provider: "Cisco", duration: "3-6 months", level: "Professional", rating: 4.7, students: "100K+", description: "Network Associate certification", link: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html", tags: ["Cisco", "Networking", "Infrastructure"], category: "Networking" },
    { title: "CompTIA Network+", provider: "CompTIA", duration: "2-4 months", level: "Intermediate", rating: 4.5, students: "80K+", description: "Networking fundamentals and protocols", link: "https://www.comptia.org/certifications/network", tags: ["CompTIA", "Networking", "Infrastructure"], category: "Networking" },
    { title: "Juniper JNCIA", provider: "Juniper Networks", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "15K+", description: "Junos associate certification", link: "https://www.juniper.net/us/en/training/certification/", tags: ["Juniper", "Networking", "Junos"], category: "Networking" },
    { title: "Fortinet NSE", provider: "Fortinet", duration: "2-3 months", level: "Intermediate", rating: 4.3, students: "12K+", description: "Network Security Expert", link: "https://www.fortinet.com/training/cybersecurity-professionals", tags: ["Fortinet", "Security", "Networking"], category: "Networking" },
    { title: "RHCE Engineer", provider: "Red Hat", duration: "4-8 months", level: "Professional", rating: 4.8, students: "25K+", description: "Advanced Linux system administration", link: "https://www.redhat.com/en/services/certification/rhce", tags: ["Red Hat", "Linux", "System Administration"], category: "System Administration" },
    { title: "CompTIA Linux+", provider: "CompTIA", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "35K+", description: "Linux system administration skills", link: "https://www.comptia.org/certifications/linux", tags: ["CompTIA", "Linux", "System Administration"], category: "System Administration" },
    { title: "Ubuntu Certified", provider: "Canonical", duration: "2-3 months", level: "Intermediate", rating: 4.3, students: "18K+", description: "Ubuntu Linux administration", link: "https://ubuntu.com/certification", tags: ["Ubuntu", "Linux", "Canonical"], category: "System Administration" },
    { title: "SUSE Admin", provider: "SUSE", duration: "2-4 months", level: "Intermediate", rating: 4.2, students: "10K+", description: "SUSE Linux Enterprise administration", link: "https://www.suse.com/training/", tags: ["SUSE", "Linux", "Enterprise"], category: "System Administration" },
    { title: "ISTQB Foundation", provider: "ISTQB", duration: "1-2 months", level: "Beginner", rating: 4.5, students: "150K+", description: "Software testing fundamentals", link: "https://www.istqb.org/", tags: ["Testing", "Quality Assurance", "ISTQB"], category: "Quality Assurance" },
    { title: "Selenium WebDriver", provider: "Selenium", duration: "1-3 months", level: "Intermediate", rating: 4.4, students: "40K+", description: "Automated web testing", link: "https://selenium.dev/", tags: ["Selenium", "Automation", "Testing"], category: "Quality Assurance" },
    { title: "CBAP Certification", provider: "IIBA", duration: "4-8 months", level: "Professional", rating: 4.6, students: "30K+", description: "Certified Business Analysis Professional", link: "https://www.iiba.org/career-resources/a-business-analysts-guide-to-career-development/certifications/cbap/", tags: ["Business Analysis", "IIBA", "Requirements"], category: "Business Analysis" },
    { title: "PMI-PBA Specialist", provider: "PMI", duration: "3-6 months", level: "Professional", rating: 4.5, students: "20K+", description: "Professional in Business Analysis", link: "https://www.pmi.org/certifications/business-analysis-pba", tags: ["Business Analysis", "PMI", "Requirements"], category: "Business Analysis" },
    { title: "Google Ads", provider: "Google", duration: "1-2 months", level: "Beginner", rating: 4.4, students: "200K+", description: "Online advertising with Google Ads", link: "https://skillshop.withgoogle.com/", tags: ["Google Ads", "Marketing", "Advertising"], category: "Digital Marketing" },
    { title: "Google Analytics", provider: "Google", duration: "1-2 months", level: "Beginner", rating: 4.5, students: "180K+", description: "Web analytics and data insights", link: "https://skillshop.withgoogle.com/", tags: ["Google Analytics", "Marketing", "Analytics"], category: "Digital Marketing" },
    { title: "Facebook Blueprint", provider: "Meta", duration: "1-3 months", level: "Intermediate", rating: 4.3, students: "100K+", description: "Social media marketing expertise", link: "https://www.facebook.com/business/learn", tags: ["Facebook", "Social Media", "Marketing"], category: "Digital Marketing" },
    { title: "HubSpot Content", provider: "HubSpot", duration: "1-2 months", level: "Beginner", rating: 4.4, students: "80K+", description: "Inbound marketing strategies", link: "https://academy.hubspot.com/", tags: ["HubSpot", "Content Marketing", "Inbound"], category: "Digital Marketing" },
    { title: "Bitcoin Professional", provider: "CryptoCurrency Certification", duration: "2-4 months", level: "Intermediate", rating: 4.3, students: "15K+", description: "Bitcoin and blockchain fundamentals", link: "https://cryptoconsortium.org/certifications/CBP", tags: ["Bitcoin", "Blockchain", "Cryptocurrency"], category: "Blockchain" },
    { title: "Ethereum Developer", provider: "ConsenSys", duration: "3-6 months", level: "Advanced", rating: 4.5, students: "12K+", description: "Smart contract development", link: "https://consensys.net/academy/", tags: ["Ethereum", "Smart Contracts", "Blockchain"], category: "Blockchain" },
    { title: "Hyperledger Developer", provider: "Linux Foundation", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "8K+", description: "Enterprise blockchain development", link: "https://www.hyperledger.org/", tags: ["Hyperledger", "Blockchain", "Enterprise"], category: "Blockchain" },
    { title: "ITIL 4 Foundation", provider: "PeopleCert", duration: "1-2 months", level: "Beginner", rating: 4.5, students: "300K+", description: "IT service management best practices", link: "https://www.axelos.com/certifications/itil-service-management", tags: ["ITIL", "Service Management", "ITSM"], category: "IT Management" },
    { title: "COBIT Foundations", provider: "ISACA", duration: "2-3 months", level: "Intermediate", rating: 4.4, students: "40K+", description: "IT governance framework", link: "https://www.isaca.org/credentialing/cobit", tags: ["COBIT", "Governance", "Framework"], category: "IT Management" },
    { title: "Salesforce Admin", provider: "Salesforce", duration: "2-4 months", level: "Intermediate", rating: 4.6, students: "100K+", description: "Salesforce platform administration", link: "https://trailhead.salesforce.com/credentials/administrator", tags: ["Salesforce", "CRM", "Administration"], category: "Salesforce" },
    { title: "Salesforce Developer", provider: "Salesforce", duration: "3-6 months", level: "Professional", rating: 4.5, students: "60K+", description: "Custom Salesforce development", link: "https://trailhead.salesforce.com/credentials/platformdeveloper", tags: ["Salesforce", "Development", "Apex"], category: "Salesforce" },
    { title: "SAP Application Assoc", provider: "SAP", duration: "3-6 months", level: "Professional", rating: 4.4, students: "50K+", description: "SAP ERP system expertise", link: "https://training.sap.com/certification", tags: ["SAP", "ERP", "Enterprise"], category: "SAP" },
    { title: "VMware Professional", provider: "VMware", duration: "3-6 months", level: "Professional", rating: 4.6, students: "80K+", description: "Virtualization and cloud infrastructure", link: "https://www.vmware.com/education-services/certification.html", tags: ["VMware", "Virtualization", "Infrastructure"], category: "Infrastructure" },
    { title: "Microsoft Hyper-V", provider: "Microsoft", duration: "2-4 months", level: "Intermediate", rating: 4.3, students: "25K+", description: "Windows Server virtualization", link: "https://docs.microsoft.com/en-us/learn/certifications/", tags: ["Hyper-V", "Virtualization", "Windows Server"], category: "Infrastructure" },
    { title: "Cloudera Data Engineer", provider: "Cloudera", duration: "3-6 months", level: "Professional", rating: 4.5, students: "20K+", description: "Big data engineering with Hadoop", link: "https://www.cloudera.com/about/training/certification.html", tags: ["Cloudera", "Big Data", "Hadoop"], category: "Big Data" },
    { title: "Spark Developer", provider: "Databricks", duration: "2-4 months", level: "Intermediate", rating: 4.6, students: "15K+", description: "Distributed data processing", link: "https://academy.databricks.com/", tags: ["Spark", "Big Data", "Analytics"], category: "Big Data" },
    { title: "Elastic Engineer", provider: "Elastic", duration: "2-3 months", level: "Intermediate", rating: 4.4, students: "12K+", description: "Elasticsearch and data search", link: "https://www.elastic.co/training/certification", tags: ["Elasticsearch", "Search", "Analytics"], category: "Big Data" },
    { title: "Jira Administrator", provider: "Atlassian", duration: "1-2 months", level: "Intermediate", rating: 4.4, students: "30K+", description: "Project tracking and management", link: "https://www.atlassian.com/university/certification", tags: ["Jira", "Project Management", "Atlassian"], category: "Specialized" },
    { title: "Snowflake Core", provider: "Snowflake", duration: "2-3 months", level: "Intermediate", rating: 4.6, students: "15K+", description: "Cloud data warehouse platform", link: "https://www.snowflake.com/certifications/", tags: ["Snowflake", "Data Warehouse", "Cloud"], category: "Database" },
    { title: "Unity Developer", provider: "Unity Technologies", duration: "2-4 months", level: "Intermediate", rating: 4.5, students: "25K+", description: "Game development with Unity", link: "https://unity.com/products/unity-certifications", tags: ["Unity", "Game Development", "C#"], category: "Game Dev" },
    { title: "Unreal Engine Dev", provider: "Epic Games", duration: "2-4 months", level: "Intermediate", rating: 4.4, students: "15K+", description: "Game development with Unreal Engine", link: "https://www.unrealengine.com/", tags: ["Unreal Engine", "Game Development", "C++"], category: "Game Dev" }
];

const categories = [
    "All", "Cloud", "DevOps", "Cybersecurity", "Programming", "Data Science", "AI & ML", "Database",
    "Project Management", "Web Development", "Mobile Development", "Networking", "System Administration",
    "Quality Assurance", "Blockchain", "Salesforce", "Infrastructure", "Big Data", "Game Dev"
];

export default function CertificationPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const getLogo = (cert: any) => {
        // Prioritize specific product/title matches first for high-impact tools
        const titleMatch = Object.keys(techLogos).find(key => cert.title.toLowerCase().includes(key.toLowerCase()));
        if (titleMatch) return techLogos[titleMatch];

        // Then check tags for specialized tech (like "Jira" in tags)
        const techMatch = cert.tags.find((tag: string) => techLogos[tag]);
        if (techMatch) return techLogos[techMatch];

        // Fallback to the corporate provider
        if (techLogos[cert.provider]) return techLogos[cert.provider];
        
        return "https://upload.wikimedia.org/wikipedia/commons/a/ab/Circle-icons-cloud.svg";
    };

    const filteredCertificates = useMemo(() => {
        return certificates.filter(cert => {
            const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cert.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cert.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === "All" || cert.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
            <Navbar />
            <SubNavbar />

            <main>
                {/* Condensed Hero Section */}
                <section className="bg-zinc-900 py-10 md:py-12 border-b border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[100px] pointer-events-none" />
                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="max-w-3xl space-y-2">
                            <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-blue-400 text-[8px] font-bold uppercase tracking-widest leading-none">
                                Validation Base
                            </div>
                            <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                                Global <span className="text-violet-500">Certifications</span>.
                            </h1>
                            <p className="text-zinc-400 text-[14px] font-normal max-w-xl">
                                180+ industry-recognized modules synchronized from global technology leaders.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Condensed Action Bar */}
                <section className="sticky top-[64px] z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 py-3 shadow-sm">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search modules..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-9 pl-10 pr-4 bg-zinc-50 border border-zinc-200 text-[13px] focus:outline-none focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div ref={scrollContainerRef} className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto no-scrollbar">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`whitespace-nowrap px-3.5 h-8 text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat
                                            ? "bg-zinc-900 text-white"
                                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* High-Density Simplified Grid */}
                <section className="py-8 md:py-10 bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredCertificates.map((cert, index) => (
                                <div
                                    key={index}
                                    className="group flex flex-col bg-white border border-zinc-200 hover:border-blue-600 transition-all duration-200 p-5 rounded-none"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-7 w-auto flex items-center justify-start transition-all">
                                            <img
                                                src={getLogo(cert)}
                                                alt={cert.provider}
                                                className="h-full w-auto object-contain max-w-[120px]"
                                                onError={(e) => { (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Circle-icons-cloud.svg"; }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 text-zinc-400">
                                            <Star size={10} className="text-orange-400 fill-orange-400" />
                                            <span className="text-[10px] font-bold">{cert.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-[14px] font-bold text-zinc-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {cert.title}
                                    </h3>
                                    <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider mb-3">
                                        {cert.provider}
                                    </p>

                                    <div className="flex items-center gap-3 text-zinc-400 mb-4 font-mono text-[9px] font-bold uppercase">
                                        <div className="flex items-center gap-1">
                                            <Clock size={10} />
                                            <span>{cert.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck size={10} />
                                            <span>{cert.level}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between group/link"
                                    >
                                        <span className="text-[10px] font-bold text-zinc-400 group-hover/link:text-blue-600 uppercase tracking-widest transition-colors">Start Course</span>
                                        <ExternalLink size={12} className="text-zinc-300 group-hover/link:text-blue-600 transition-colors" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
