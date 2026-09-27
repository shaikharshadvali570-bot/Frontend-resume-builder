function val(id){
    const el=document.getElementById(id);
    return el?el.value.trim():"";
}

function removeBlock(btn){
    btn.parentElement.remove();
    generateResume();
}

function addEducation(){
    const div=document.createElement("div");
    div.className="edu-block";
    div.innerHTML=`
        <input placeholder="Degree">
        <input placeholder="University">
        <input placeholder="Year">
        <button class="remove-btn" onclick="removeBlock(this)">Remove</button>
    `;
    document.getElementById("education-section").appendChild(div);
}

function addExperience(){
    const div=document.createElement("div");
    div.className="exp-block";
    div.innerHTML=`
        <input placeholder="Job Title">
        <input placeholder="Company">
        <textarea placeholder="Responsibilities"></textarea>
        <button class="remove-btn" onclick="removeBlock(this)">Remove</button>
    `;
    document.getElementById("experience-section").appendChild(div);
}

function addProject(){
    const div=document.createElement("div");
    div.className="project-block";
    div.innerHTML=`
        <input placeholder="Project Title">
        <input placeholder="Organization">
        <textarea placeholder="Description"></textarea>
        <button class="remove-btn" onclick="removeBlock(this)">Remove</button>
    `;
    document.getElementById("projects-section").appendChild(div);
}

function setTheme(theme){
    document.documentElement.setAttribute("data-theme",theme);
    localStorage.setItem("theme",theme);
}

function loadTheme(){
    const savedTheme=localStorage.getItem("theme");
    if(savedTheme){
        document.documentElement.setAttribute("data-theme",savedTheme);
    }
}

function setFont(font){
    document.body.classList.remove("corporate","modern","elegant","academic");
    document.body.classList.add(font);
    localStorage.setItem("font",font);
}

function loadFont(){
    const savedFont=localStorage.getItem("font");
    if(savedFont){
        document.body.classList.add(savedFont);
    }
}

function toggleDarkMode(){
    const current=document.documentElement.getAttribute("data-theme");
    if(current==="dark"){
        setTheme("blue");
    }else{
        setTheme("dark");
    }
}

function applyTemplate(){
    const template=val("template");
    const resume=document.getElementById("resume");
    if(!resume)return;
    resume.classList.remove("template-classic","template-modern","template-minimal");
    resume.classList.add("template-"+template);
}

function generateResume(){
    applyTemplate();

    document.getElementById("r-name").innerText=val("name");

    const contact=[];
    if(val("email"))contact.push(val("email"));
    if(val("phone"))contact.push(val("phone"));
    if(val("location"))contact.push(val("location"));

    document.getElementById("r-contact").innerText=contact.join(" | ");

    document.getElementById("r-summary").innerText=val("summary");

    const skills=val("skills")
        .split(",")
        .map(s=>s.trim())
        .filter(Boolean);

    document.getElementById("r-skills").innerHTML=
        skills.map(skill=>`<span class="skill-badge">${skill}</span>`).join("");

    document.getElementById("r-tools").innerText=val("tools");
    document.getElementById("r-languages").innerText=val("languages");

    let expHTML="";

    document.querySelectorAll(".exp-block").forEach(block=>{
        const title=block.children[0].value;
        const company=block.children[1].value;

        const resp=block.children[2].value
            .split("\n")
            .filter(Boolean)
            .map(r=>`<li>${r}</li>`)
            .join("");

        expHTML+=`
            <div class="exp-item">
                <strong>${title}</strong>
                <p>${company}</p>
                <ul>${resp}</ul>
            </div>
        `;
    });

    document.getElementById("r-experience").innerHTML=expHTML;

    let eduHTML="";

    document.querySelectorAll(".edu-block").forEach(block=>{
        eduHTML+=`
            <p>
                <strong>${block.children[0].value}</strong><br>
                ${block.children[1].value}<br>
                ${block.children[2].value}
            </p>
        `;
    });

    document.getElementById("r-education").innerHTML=eduHTML;

    let projHTML="";

    document.querySelectorAll(".project-block").forEach(block=>{
        const desc=block.children[2].value
            .split("\n")
            .filter(Boolean)
            .map(d=>`<li>${d}</li>`)
            .join("");

        projHTML+=`
            <p><strong>${block.children[0].value}</strong></p>
            <p>${block.children[1].value}</p>
            <ul>${desc}</ul>
        `;
    });

    document.getElementById("r-projects").innerHTML=projHTML;

    document.getElementById("r-certifications").innerHTML=
        val("certifications")
            .split("\n")
            .filter(Boolean)
            .map(c=>`<li>${c}</li>`)
            .join("");

    document.getElementById("r-achievements").innerHTML=
        val("achievements")
            .split("\n")
            .filter(Boolean)
            .map(a=>`<li>${a}</li>`)
            .join("");
}

function downloadPDF(){
    html2pdf().set({
        margin:0.5,
        filename:"resume.pdf",
        image:{type:'jpeg',quality:1},
        html2canvas:{scale:2},
        jsPDF:{unit:'in',format:'letter',orientation:'portrait'}
    }).from(document.getElementById("resume")).save();
}

function downloadDOCX(){
    const content=document.getElementById("resume").innerHTML;

    const blob=htmlDocx.asBlob(`
        <html>
        <head><meta charset="UTF-8"></head>
        <body>${content}</body>
        </html>
    `);

    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download="resume.docx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function saveResume(){
    const data={
        name:val("name"),
        email:val("email"),
        phone:val("phone"),
        location:val("location"),
        summary:val("summary"),
        skills:val("skills"),
        tools:val("tools"),
        languages:val("languages"),
        certifications:val("certifications"),
        achievements:val("achievements")
    };

    localStorage.setItem("resumeData",JSON.stringify(data));
}

function loadResume(){
    const data=JSON.parse(localStorage.getItem("resumeData"));
    if(!data)return;

    Object.keys(data).forEach(key=>{
        const el=document.getElementById(key);
        if(el)el.value=data[key];
    });

    generateResume();
}

function checkATS(){
    let score=0;
    const tips=[];

    if(val("name"))score+=10;
    else tips.push("Add full name");

    if(val("email"))score+=10;
    else tips.push("Add email");

    if(val("phone"))score+=10;
    else tips.push("Add phone");

    if(val("summary"))score+=10;
    else tips.push("Add summary");

    if(val("skills").split(",").filter(Boolean).length>=5)
        score+=20;
    else tips.push("Add at least 5 skills");

    if(document.querySelectorAll(".exp-block").length)
        score+=20;
    else tips.push("Add experience");

    if(document.querySelectorAll(".edu-block").length)
        score+=20;
    else tips.push("Add education");

    document.getElementById("ats-score").innerText=`ATS Score: ${score}/100`;

    document.getElementById("ats-tips").innerHTML=
        tips.map(t=>`<li>${t}</li>`).join("");
}

document.addEventListener("input",function(e){
    if(
        e.target.matches("input")||
        e.target.matches("textarea")||
        e.target.matches("select")
    ){
        generateResume();
    }
});

window.onload=function(){
    loadTheme();
    loadFont();
    loadResume();
    generateResume();
};