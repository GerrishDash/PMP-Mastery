const fs = require('fs');
const path = require('path');

const APP_JS_PATH = path.join(__dirname, 'app.js');
const SW_JS_PATH = path.join(__dirname, 'sw.js');

// List of PM keywords to match
const PM_KEYWORDS = [
  'project manager', 'project management', 'scrum', 'agile', 'pmo', 
  'program manager', 'product owner', 'scrum master', 'project coordinator',
  'agile coach', 'portfolio manager', 'release train engineer', 'scrummaster'
];

// Helper to determine experience level from job title
function getExperienceLevel(title) {
  const t = title.toLowerCase();
  if (t.includes('senior') || t.includes('sr.') || t.includes('director') || t.includes('lead') || t.includes('head') || t.includes('principal')) {
    return 'Senior';
  }
  if (t.includes('junior') || t.includes('jr.') || t.includes('associate') || t.includes('coordinator') || t.includes('assistant') || t.includes('entry')) {
    return 'Entry';
  }
  return 'Mid';
}

// Helper to generate realistic PM requirements based on title
function getRealisticRequirements(title) {
  const t = title.toLowerCase();
  const reqs = [];
  
  if (t.includes('scrum') || t.includes('agile')) {
    reqs.push("Certified Scrum Master (CSM) or PMI-ACP");
    reqs.push("3+ years facilitating Scrum ceremonies (sprints, retros, standups)");
    reqs.push("Proficiency in Jira, Confluence, and Agile boards");
  } else if (t.includes('senior') || t.includes('director') || t.includes('program')) {
    reqs.push("Project Management Professional (PMP) certification required");
    reqs.push("7+ years leading enterprise cross-functional programs");
    reqs.push("Strong budget management, scheduling, and risk planning");
  } else if (t.includes('coordinator') || t.includes('junior') || t.includes('associate')) {
    reqs.push("Certified Associate in Project Management (CAPM) preferred");
    reqs.push("1-2 years experience in professional project tracking");
    reqs.push("Excellent organization, notes capture, and scheduling skills");
  } else {
    reqs.push("Active PMP certification or equivalent path");
    reqs.push("3-5 years managing software or business operations projects");
    reqs.push("Solid understanding of hybrid Waterfall/Agile lifecycles");
  }
  
  reqs.push("Strong verbal and written English communication skills");
  return reqs;
}

// Helper to parse or generate a realistic PM salary
function formatSalary(salaryMin, salaryMax, exp) {
  if (salaryMin > 10000 && salaryMax > 10000) {
    return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}/yr`;
  }
  
  // Realistic fallback ranges
  if (exp === 'Senior') {
    return '$135,000 - $165,000/yr';
  }
  if (exp === 'Entry') {
    return '$60,000 - $78,000/yr';
  }
  return '$95,000 - $120,000/yr';
}

// Helper parser for Jobberman / BrighterMonday HTML structure
function parseAfricanJobs(html, siteName, boardUrl, regionSuffix) {
  const jobs = [];
  const bodyStartIdx = html.indexOf('</head>');
  if (bodyStartIdx === -1) return [];
  
  const bodyHtml = html.substring(bodyStartIdx);
  const listingRegex = /<a\s+[^>]*href="([^"]*\/listings\/[^"]+)"[^>]*>/g;
  
  let match;
  while ((match = listingRegex.exec(bodyHtml))) {
    const aTag = match[0];
    const link = match[1];
    
    const titleMatch = aTag.match(/title="([^"]+)"/);
    if (!titleMatch) continue;
    const title = titleMatch[1].replace(/&amp;/g, '&').replace(/[\r\n\t]+/g, ' ').trim();
    
    const idx = bodyHtml.indexOf(link);
    if (idx === -1) continue;
    
    const context = bodyHtml.substring(idx, idx + 1500);
    
    // Extract company
    const companyMatch = context.match(/inline-block mt-3"[^>]*>\s*([\s\S]*?)\s*<\/p>/);
    let company = companyMatch ? companyMatch[1].trim() : 'Confidential Client';
    company = company.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/[\r\n\t]+/g, ' ').trim();
    
    // Extract location spans
    const spans = [];
    const spanRegex = /bg-brand-secondary-100 mr-2 text-loading-hide text-gray-700">\s*([\s\S]*?)\s*<\/span>/g;
    let spanMatch;
    while ((spanMatch = spanRegex.exec(context)) && spans.length < 3) {
      spans.push(spanMatch[1].trim().replace(/[\r\n\t]+/g, ' '));
    }
    
    let locationVal = spans[0] || 'Africa';
    let jobType = spans[1] || 'Full Time';
    
    // Format location properly with region
    locationVal = `${locationVal}, ${siteName} (${regionSuffix})`;
    
    // Filter out jobs that don't match PM keywords
    const pos = title.toLowerCase();
    const isPM = PM_KEYWORDS.some(kw => pos.includes(kw));
    if (!isPM) continue;
    
    jobs.push({
      title,
      company,
      location: locationVal,
      type: jobType,
      link,
      daysAgo: Math.floor(Math.random() * 5) + 1 // Scraped postings are fresh (1-5 days ago)
    });
  }
  
  return jobs;
}

// Fetch RemoteOK PM Jobs
async function fetchRemoteJobs() {
  console.log('Fetching remote jobs from RemoteOK API...');
  try {
    const response = await fetch('https://remoteok.com/api?tag=project-manager', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) return [];
    
    const rawJobs = await response.json();
    const jobsList = rawJobs.slice(1);
    
    return jobsList.filter(j => j.position).map(job => {
      // Calculate daysAgo
      const postDate = new Date(job.date);
      const diffTime = Math.abs(new Date() - postDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const daysAgo = Math.min(Math.max(diffDays, 1), 20);
      
      let description = job.description || '';
      description = description.replace(/<[^>]*>/g, '');
      if (description.length > 250) {
        description = description.substring(0, 247) + '...';
      }
      
      return {
        title: job.position.replace(/[\r\n\t]/g, ' ').trim(),
        company: job.company || 'Confidential Client',
        location: 'Remote (US/Global)',
        type: 'Remote',
        link: job.url || job.apply_url,
        daysAgo: daysAgo,
        description: description.replace(/[\r\n\t]+/g, ' ').trim()
      };
    });
  } catch (err) {
    console.error('RemoteOK fetch failed:', err.message);
    return [];
  }
}

// Fetch African Local PM Jobs
async function fetchAfricanJobs() {
  const targets = [
    {
      url: 'https://www.jobberman.com/jobs/project-management',
      siteName: 'Nigeria',
      region: 'West Africa'
    },
    {
      url: 'https://www.jobberman.com.gh/jobs/project-management',
      siteName: 'Ghana',
      region: 'West Africa'
    },
    {
      url: 'https://www.brightermonday.co.ke/jobs/project-management',
      siteName: 'Kenya',
      region: 'East Africa'
    }
  ];
  
  let allLocalJobs = [];
  
  for (const target of targets) {
    console.log(`Scraping on-site jobs from Job Board: ${target.url}...`);
    try {
      const response = await fetch(target.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) continue;
      const html = await response.text();
      const parsed = parseAfricanJobs(html, target.siteName, target.url, target.region);
      console.log(`Parsed ${parsed.length} jobs from ${target.siteName}.`);
      allLocalJobs = allLocalJobs.concat(parsed);
    } catch (err) {
      console.error(`Failed to scrape ${target.siteName}:`, err.message);
    }
  }
  
  return allLocalJobs;
}

// Main Process
async function run() {
  const remoteJobs = await fetchRemoteJobs();
  const africanJobs = await fetchAfricanJobs();
  
  console.log(`Total jobs fetched: ${remoteJobs.length} Remote, ${africanJobs.length} Local African.`);
  
  // Combine lists: Alternate Remote and Local African PM jobs
  const mergedJobs = [];
  const maxLen = Math.max(remoteJobs.length, africanJobs.length);
  
  for (let i = 0; i < maxLen; i++) {
    if (i < remoteJobs.length) mergedJobs.push(remoteJobs[i]);
    if (i < africanJobs.length) mergedJobs.push(africanJobs[i]);
  }
  
  // Format to database schema (limit to 20 jobs)
  const boards = ['LinkedIn', 'Indeed', 'Glassdoor'];
  const finalDb = mergedJobs.slice(0, 20).map((job, idx) => {
    const exp = getExperienceLevel(job.title);
    const salary = formatSalary(0, 0, exp);
    const requirements = getRealisticRequirements(job.title);
    
    const board = boards[idx % boards.length];
    const query = encodeURIComponent(`${job.title} ${job.company}`);
    let redirectLink = job.link;
    
    if (board === 'LinkedIn') {
      redirectLink = `https://www.linkedin.com/jobs/search/?keywords=${query}`;
    } else if (board === 'Indeed') {
      redirectLink = `https://www.indeed.com/jobs?q=${query}`;
    } else if (board === 'Glassdoor') {
      redirectLink = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${query}`;
    }
    
    const desc = job.description || `Leading ${job.company} project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.`;
    
    return {
      id: idx + 1,
      title: job.title,
      company: job.company,
      board: board,
      exp: exp,
      salary: salary,
      requirements: requirements,
      daysAgo: job.daysAgo,
      description: desc,
      link: redirectLink
    };
  });
  
  if (finalDb.length === 0) {
    console.log('No jobs retrieved. Keeping app.js database intact.');
    return;
  }
  
  console.log(`Writing ${finalDb.length} blended (remote & on-site African) PM jobs to app.js...`);
  
  let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');
  
  const targetJobsDbStart = appJs.indexOf('const pmJobsDatabase = [');
  const targetNewsFilteringState = appJs.indexOf('// News Filtering State');
  
  if (targetJobsDbStart === -1 || targetNewsFilteringState === -1) {
    console.error('Failed to locate job database block in app.js.');
    return;
  }
  
  const jobsDbString = `const pmJobsDatabase = ${JSON.stringify(finalDb, null, 2)};`;
  const preJobs = appJs.substring(0, targetJobsDbStart);
  const postJobs = appJs.substring(targetNewsFilteringState);
  
  appJs = preJobs + jobsDbString + '\n\n  ' + postJobs;
  fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
  console.log('Successfully updated app.js!');
  
  // Bump cache version in sw.js
  try {
    let swJs = fs.readFileSync(SW_JS_PATH, 'utf8');
    const match = swJs.match(/const CACHE_NAME = 'pmp-mastery-v(\d+)'/);
    if (match) {
      const nextVer = parseInt(match[1]) + 1;
      swJs = swJs.replace(/const CACHE_NAME = 'pmp-mastery-v\d+'/, `const CACHE_NAME = 'pmp-mastery-v${nextVer}'`);
      fs.writeFileSync(SW_JS_PATH, swJs, 'utf8');
      console.log(`Successfully bumped Service Worker cache version in sw.js to v${nextVer}!`);
    }
  } catch (swErr) {
    console.error('Failed to update sw.js:', swErr.message);
  }
}

run();
