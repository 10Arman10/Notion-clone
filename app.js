const user_name = document.querySelector(".user_name");
const sidebar = document.querySelector(".sidebar");
const menu_toggle_btn = document.querySelectorAll(".menu_toggle_menu")
const settings_toggle = document.querySelector(".settings_toggle");
const sidebar_modal = document.querySelector(".settings_modal");
const user_name_settings = document.querySelector("#user_name_settings");
const settings_sidebar = document.querySelector("#settings_sidebar")
const option_text = document.querySelector("#option_text");
const under_text = document.querySelector("#under_text");
const option_icon = document.querySelector(".option_icon");
const pagehead_btn = document.querySelector(".page_header_toggle");
const pages_container = document.querySelector("[data-pages]");
const name_logo = document.querySelector(".name_logo");
const content_section = document.querySelector(".content_section");
const add_template_btns = document.querySelectorAll(".add_template_btn")
const blocks = document.querySelectorAll(".block");
const favorite_box = document.querySelector(".favorites_container");
const upper_text = document.querySelector(".upper_text");
const talk_toggle = document.querySelector("[data-talk_toggle]")

const LOCAL_STOREAGE_KEY = "page_lists";
const LOCAL_STOREAGE_ACTIVE_KEY = "page_lists_active";

let pages = JSON.parse(localStorage.getItem( LOCAL_STOREAGE_KEY ) ) || [];
let pages_active_list = localStorage.getItem( LOCAL_STOREAGE_ACTIVE_KEY );


//Speech Reciginition

let talk_i = talk_toggle.children[0].outerHTML;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recogntion = new window.SpeechRecognition();
recogntion.interimResults = true;

let text_result = document.createElement("p");

talk_toggle.addEventListener("click" , () => {
    if (talk_i === `<i class="fa-solid fa-microphone"></i>`){
        recogntion.start();
        talk_i = `<i class="fa-solid fa-microphone-slash"></i>`;
    } else {
        recogntion.stop();
        talk_i = `<i class="fa-solid fa-microphone"></i>`;
    }
    talk_toggle.innerHTML = talk_i;
})

recogntion.addEventListener("end" , () => {
    talk_i = `<i class="fa-solid fa-microphone"></i>`;
    talk_toggle.innerHTML = talk_i;
})

recogntion.addEventListener("result" , e => {
    const row = document.querySelector(".row");
    const text_row = row.querySelector(".text");
    let tasks = selected_page[0].tasks;

    const text_p_speech = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("");

    text_result.innerText = text_p_speech;
    text_result.classList.add("text_p")
    text_row.appendChild(text_result)
    
    if (e.results[0].isFinal) {
        if (text_p_speech.includes("create paragraph")) {
            console.log("paragraph")
            let text = text_result.innerText.replaceAll(/create paragraph/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock( text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create to-do")) {
            console.log("To-do app")
            let text = text_result.innerText.replaceAll(/create to-do/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_text_todo(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create heading 1")) {
            console.log("Heading 1")
            let text = text_result.innerText.replaceAll(/create heading 1/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_heading_one(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create heading to")) {
            console.log("Heading 2")
            let text = text_result.innerText.replaceAll(/create heading to/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_heading_two(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create bulleted list")) {
            console.log("Bulleted list")
            let text = text_result.innerText.replaceAll(/create bulleted list/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_bulleted(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create number list")) {
            console.log("Numbered list")
            let text = text_result.innerText.replaceAll(/create numbered list/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_numbered(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create toggle list")) {
            console.log("Toggle list")
            let text = text_result.innerText.replaceAll(/create toggle list/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_toggle(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        if (text_p_speech.includes("create quote")) {
            console.log("Quote list")
            let text = text_result.innerText.replaceAll(/create quote/ig , "")
            let block_ID_SET = Date.now().toString(); 
            const create_block = setBlock_quote(text , block_ID_SET);
            selected_page[0].tasks.push(create_block);
        }
        sat()
    }
    
    save()
})

//Adding Templates
add_template_btns.forEach(add_btn => {
    add_btn.addEventListener("click" , createTemplate);
})

blocks.forEach(block => {
    block.addEventListener("click" , isBlock);
    block.addEventListener("click" , sat)
})

function isBlock(e) {
    let target = e.target;
    const row = target.parentElement.parentElement.parentElement;
    row.children[1].classList.remove("show_block_section");
    if(target.hasAttribute("data-text_block")) {
        saveBlock();
    }
    if(target.hasAttribute("data-header_h1_block")) {
        saveBlockHeading_one();
    }
    if(target.hasAttribute("data-header_h2_block")) {
        saveBlockHeading_two();
    }
    if(target.hasAttribute("data-to_do_block")) {
        saveBlock_Text_todo();
    }
    if(target.hasAttribute("data-bulleted_block")) {
        saveBlock_bulleted();
    }
    if(target.hasAttribute("data-numbered_block")) {
        saveBlock_numbered();
    }
    if(target.hasAttribute("data-toggle_block")) {
        saveBlock_toggle();
    }
    if(target.hasAttribute("data-quote_block")) {
        saveBlock_quote();
    }
}

function saveBlock() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlockHeading_one() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_heading_one(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlockHeading_two() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_heading_two(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlock_Text_todo() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_text_todo(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlock_bulleted() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_bulleted(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlock_numbered() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_numbered(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlock_toggle() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_toggle = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_toggle(block_title_name , block_ID_SET , block_toggle);
    selected_page[0].tasks.push(create_block)
    save()
}

function saveBlock_quote() {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const block_title_name = "";
    const block_ID_SET =  Date.now().toString();
    const create_block = setBlock_quote(block_title_name , block_ID_SET);
    selected_page[0].tasks.push(create_block)
    save()
}

function sat(e) {
    selected_page = pages.filter(page => page.id == pages_active_list);
    const row = document.querySelector(".row");
    const text_row = row.querySelector(".text");
    let tasks = selected_page[0].tasks;
    clear_page(text_row);
    tasks.forEach(task => {
        if(task.paragraph === true) {
            const text_p = document.createElement("p");
            text_p.innerText = task.name;
            text_p.dataset.text = "Type //"
            text_p.dataset.ID = task.id;
            text_p.contentEditable = "true";
            text_p.classList.add("text_p");
            text_row.appendChild(text_p)
        }
        if (task.heading_one === true) {
            const text_h1 = document.createElement("h1");
            text_h1.innerText = task.name;
            text_h1.dataset.text = "Heading 1 //"
            text_h1.dataset.ID = task.id;
            text_h1.contentEditable = "true";
            text_h1.classList.add("text_h1");
            text_row.appendChild(text_h1)
        }
        if (task.heading_two === true) {
            const text_h2 = document.createElement("h2");
            text_h2.innerText = task.name;
            text_h2.dataset.text = "Heading 2 //"
            text_h2.dataset.ID = task.id;
            text_h2.contentEditable = "true";
            text_h2.classList.add("text_h2");
            text_row.appendChild(text_h2);
        }
        if (task.text_todo === true) {
            const todo_box = document.createElement("div");
            todo_box.classList.add("todo_box");
            const text_p_todo = document.createElement("p");
            text_p_todo.innerText = task.name;
            text_p_todo.dataset.text = "To-do //"
            text_p_todo.dataset.ID = task.id;
            text_p_todo.contentEditable = "true";
            const checkbox = document.createElement('input');
            checkbox.classList.add("check_todo");
            checkbox.type = "checkbox";
            checkbox.name = "name";
            checkbox.value = "value";
            text_p_todo.classList.add("text_p_todo");
            todo_box.appendChild(checkbox);
            todo_box.appendChild(text_p_todo);
            text_row.appendChild(todo_box);
            checkbox.addEventListener("click" , () => {
                if (task.checked === false) {
                    checkbox.checked = true;
                    task.checked = true;
                    text_p_todo.style.textDecoration = "line-through"
                    text_p_todo.style.color = "#7D7C78";
                } else {
                    checkbox.checked = false;
                    task.checked = false;
                    text_p_todo.style.textDecoration = "none"
                    text_p_todo.style.color = "#37352F";
                }
                save()
            })
            switch(task.checked) {
                case true:
                    text_p_todo.style.textDecoration = "line-through";
                    text_p_todo.style.color = "#7D7C78";
                break
                case false:
                    text_p_todo.style.textDecoration = "none";
                    text_p_todo.style.color = "#37352F";
                break
            }
            checkbox.checked = task.checked;
        }
        if(task.bulleted === true) {
            const text_p_bulleted = document.createElement("li");
            text_p_bulleted.innerText = task.name;
            text_p_bulleted.dataset.text = "List //"
            text_p_bulleted.dataset.ID = task.id;
            text_p_bulleted.contentEditable = "true";
            text_p_bulleted.classList.add("text_p_bulleted");
            text_row.appendChild(text_p_bulleted)
        }
        if(task.numbered === true) {
            const text_p_numbered = document.createElement("li");
            text_p_numbered.innerText = task.name;
            text_p_numbered.dataset.text = "List //"
            text_p_numbered.dataset.ID = task.id;
            text_p_numbered.contentEditable = "true";
            text_p_numbered.classList.add("text_p_numbered");
            text_row.appendChild(text_p_numbered)
        }
        if(task.toggle === true) {
            const toggle_box = document.createElement("div");
            const toggle_container = document.createElement("div");
            const toggle_text = document.createElement("p");
            const toggle_toggle = document.createElement("button");
            const toggle_content = document.createElement("div");
            const toggle_content_text = document.createElement("p");
            toggle_toggle.innerHTML = `<i class="fa-solid fa-play"></i>`
            toggle_text.innerText = task.name;
            toggle_text.classList.add("toggle_text");
            toggle_text.dataset.text = "Toggle //"
            toggle_text.dataset.ID = task.id;
            toggle_box.dataset.ID = task.id
            toggle_toggle.dataset.ID = task.id
            toggle_text.contentEditable = "true";
            toggle_box.classList.add("toggle");
            toggle_content.dataset.ID = task.id;
            toggle_toggle.classList.add("toggle_toggle");
            toggle_content.classList.add("toggle_content");
            toggle_content_text.classList.add("toggle_content_text");
            toggle_content_text.contentEditable = "true";
            toggle_content_text.dataset.text = "Text //";
            toggle_container.classList.add("toggle_container");
            toggle_content_text.dataset.ID = task.id;
            toggle_content_text.addEventListener("input" , () => {
                task.toggle_text = toggle_content_text.innerText;
            })
            toggle_content_text.innerText = task.toggle_text;
            toggle_text.innerText = task.name;
            toggle_content.appendChild(toggle_content_text);
            toggle_container.appendChild(toggle_toggle);
            toggle_container.appendChild(toggle_text);
            toggle_box.appendChild(toggle_container);
            toggle_box.appendChild(toggle_content);
            text_row.appendChild(toggle_box);
            toggle_toggle.addEventListener("click" , (w) => {
                toggle_toggle.children[0].classList.toggle("rotate");
                toggle_content.classList.toggle("show");
            })
        }
        if(task.quote === true) {
            const text_p_quote = document.createElement("p");
            text_p_quote.innerText = task.name;
            text_p_quote.dataset.text = "Type //"
            text_p_quote.dataset.ID = task.id;
            text_p_quote.contentEditable = "true";
            text_p_quote.classList.add("text_p_quote");
            text_row.appendChild(text_p_quote);
        }
    })

    row.children[2].addEventListener("click" , (e) => { 
        if(e.target.classList[0] === "text" ||
        e.target.classList[0] === "check_todo" ||
        e.target.classList[0] === "todo_box") {
            return
        }
        const row_text = row.querySelector(".text");
        let text_id = e.target.dataset.ID
        const index = tasks.findIndex(task => task.id === text_id);
        let index_name = tasks[index].name;
        let target = e.target
        if(target.classList[0] === "text_p_todo") {
            target.addEventListener("keypress" , w => {
                if (w.keyCode === 13 || w.which === 13) {
                    w.preventDefault();
                    return  false    ;
                }
            })
        }
        target.addEventListener("input" , (w) => {
            if (target.classList[0] !== "toggle_content_text") {
                index_name = target.innerText;
                tasks[index].name = index_name;
            }
            if(index_name.length === 0) {
                target.addEventListener("keydown" , (w) => {
                    if(w.key === "Backspace") {
                        if (target.classList[0] == "text_p_todo"){
                            if (row_text.contains(target.parentElement)) {
                                row_text.removeChild(target.parentElement);
                                tasks.splice(index , 1);
                            } else {
                                return
                            }
                        } else if (target.classList[0] == "toggle_text"){
                            if (row_text.contains(target.parentElement.parentElement)) {
                                row_text.removeChild(target.parentElement.parentElement);
                                tasks.splice(index , 1);
                            } else {
                                return
                            }
                        } else {
                            if (row_text.contains(target)) {
                                tasks.splice(index , 1);
                                row_text.removeChild(target);
                            } else {
                                return
                            }
                        }
                    }
                    save()
                })
            }
            save()
        })
    })
}

function setBlock(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        paragraph : true
    }
}

function setBlock_heading_one(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        heading_one : true
    }
}

function setBlock_heading_two(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        heading_two : true
    }
}

function setBlock_text_todo(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        text_todo : true,
        checked : false
    }
}

function setBlock_bulleted(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        bulleted : true
    }
}

function setBlock_numbered(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        numbered : true
    }
}

function setBlock_toggle(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name,
        toggle_text : "",
        toggle : true
    }
}

function setBlock_quote(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        quote : true
    }
}

// const page_title = document.querySelector("[data-page-title]");

// page_title.addEventListener("click" , () => {
//     page_title.contentEditable = "true";
//     page_title.addEventListener("input" , () => {
//        let page_name = page_title.innerText;
//        const index = pages.map(e => e.id).indexOf(pages_active_list);
//        pages[index].name = page_name;
//        save()
//     })
// })

function createTemplate(e) {
    const block = document.querySelector(".block_selection");
    block.classList.add("show_block_section");

    window.addEventListener("click" , e => {
        if (block.classList[1] === "show_block_section") {
            if (e.target.classList[0] === "block_selection" ||
                e.target.classList[0] === "add_template_btn"
                )
                {
                return
            } else {
                block.classList.remove("show_block_section")
            }
        }
    })
}

// //Adding Pages

pages_container.addEventListener("click" , e => {
    if (e.target.tagName.toLowerCase() === "div") {
        pages_active_list = e.target.firstChild.dataset.pageId;
        save();
        createPage()
    }
})

function createPage() {
    clear_page(pages_container);
    createPageElement();
}

function createPageElement() {
    pages.forEach(page => {
        const page_parent = document.createElement("div")
        page_parent.classList.add("page_parent");
        
        const page_name = document.createElement("li");
        page_name.innerText = page.name
        page_name.dataset.pageId = page.id;
        page_name.classList.add("pages");

        const page_title_input_main = document.createElement("div");
        page_title_input_main.classList.add("title_main");

        const page_title_input = document.createElement("input");
        page_title_input.classList.add("page_title_input");
        page_title_input_main.appendChild(page_title_input);

        const page_title_input_btn = document.createElement("button");
        page_title_input_btn.classList.add("page_title_input_btn");
        page_title_input_btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
        page_title_input_main.appendChild(page_title_input_btn);

        page_name.appendChild(page_title_input_main);
        
        const page_menu = document.createElement("button");
        page_menu.classList.add("page_menu");
        page_menu.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;

        const page_menu_box = document.createElement("div");
        page_menu_box.classList.add("page_menu_box");
        page_menu.appendChild(page_menu_box);

        const page_box_delete = document.createElement("button");
        page_box_delete.classList.add("page_box_delete");
        page_box_delete.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
        page_menu_box.appendChild(page_box_delete);
        const page_box_delete_text = document.createElement("p");
        page_box_delete_text.innerText = "Delete";
        page_box_delete.appendChild(page_box_delete_text);

        const page_box_favorite = document.createElement("button");
        page_box_favorite.classList.add("page_box_favorite");
        page_box_favorite.innerHTML = `<i class="fa-regular fa-star"></i>`;
        page_menu_box.appendChild(page_box_favorite);
        const page_box_favorite_text = document.createElement("p");
        page_box_favorite_text.innerText = "Add to Favorities";
        page_box_favorite.appendChild(page_box_favorite_text);

        const page_box_rename = document.createElement("button");
        page_box_rename.classList.add("page_box_rename");
        page_box_rename.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        page_menu_box.appendChild(page_box_rename);
        const page_box_rename_text = document.createElement("p");
        page_box_rename_text.innerText = "Rename";
        page_box_rename.appendChild(page_box_rename_text);

        function maxInputLength() {
            const max_length = 15;
            if (page_title_input.value.length >= max_length) {
                page_title_input.value = page_title_input.value.substr(0, max_length);
            }
        }

        function titleChangeSave(e) {
            e.preventDefault();
            let input = page_title_input.value;
            let page_id = e.target.parentElement.parentElement.dataset.pageId;
            let page_index = pages.filter(page => page.id == page_id);
            let page_index_name = page_index[0];
            localStorage.setItem("nam" , input )
            page_index_name.name = localStorage.getItem("nam");
            page_index_name = localStorage.getItem("nam")
            console.log(page_index_name)

            page_name.innerText = input;
            pages[page_index] = input;
            let section_title = content_section.children[0];
            section_title.innerText = page.name;
            save()
        }

        function activeListStyle() {
            pages_active_list = page_menu.parentElement.children[0].dataset.pageId;
            page_menu_box.classList.add("page_menu_box_show");
            save();
        }

        function listMenuSection(e) {
            if (e.target === page_menu_box || 
                e.target === page_menu) {
                return
            } else {
                page_menu_box.classList.remove("page_menu_box_show");
            }

            if (page_title_input_main.classList[1] === "page_menu_box_show") {
                if (e.target.classList[0] === "page_title_input" ||
                    e.target.classList[0] === "page_box_rename" ||
                    e.target.classList[0] === "page_title_input_btn" ||
                    e.target === page_name) {
                    return
                } else {
                    page_title_input_main.classList.remove("page_menu_box_show");
                }
            }
        }

        page_title_input.addEventListener("input" , maxInputLength)
        page_title_input_btn.addEventListener("click" , titleChangeSave)
        page_menu.addEventListener("click" , activeListStyle)
        window.addEventListener("click" , listMenuSection)
        page_box_delete.addEventListener("click" , pageMenu_Settings_delete )
        page_box_rename.addEventListener("click" , () => {
            page_title_input_main.classList.add("page_menu_box_show");
        })
        if (page.id === pages_active_list) {
            let section_title = content_section.children[0];
            const index = pages.map(e => e.id).indexOf(pages_active_list);
            section_title.dataset.id = pages[index].id
            section_title.innerText = pages[index].name;
            upper_text.innerText = pages[index].name;
            page_parent.classList.add("active_page_list");
            sat()
        }
        page_parent.appendChild(page_name)
        page_parent.appendChild(page_menu)
        pages_container.appendChild(page_parent);
    })
}

function pageMenu_Settings_delete() {
    pages = pages.filter(page => page.id !== pages_active_list);
    pages_active_list = null;
    const content_section = document.querySelector(".content_section")
    content_section.children[0].innerText = "";
    const content_section_text = content_section.children[1].children[2];
    content_section_text.innerText = ""
    save();
    createPage();
}

function clear_page(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
}

pagehead_btn.addEventListener("click" , () => {
    const page_title_name = "Untitled";
    const ID_SET =  Date.now().toString();
    const create_page = setPage(page_title_name , ID_SET);
    pages.push(create_page)
    createPage()
    save()
})

function setPage(name , ID_SET) {
    return {
        id: ID_SET , 
        name : name, 
        tasks : [] 
    }
}

function save() {
    localStorage.setItem( LOCAL_STOREAGE_KEY , JSON.stringify(pages))
    localStorage.setItem( LOCAL_STOREAGE_ACTIVE_KEY , pages_active_list)
}

save();
createPage();

//Settings Options
const settings_options = [{
    text : "Appearance",
    under_text : "Customize how Notion looks on your device.",
    icon: 
    `<button type="button" class="darkmodetoggle">
    <i class="material-icons">${localStorage.getItem("theme_name")}</i>
  </button>`

},
{
    text : "Language",
    under_text : "Change the language used in the user interface.",
    icon: `
    <button class="knight">
        <i class="fa-solid fa-language" class="language"></i>
    </button>`
}]

// //Set User Name
user_name.addEventListener("input" , () => {
    let user_input = user_name.innerText;
    localStorage.setItem("user_name" , user_input);

    console.log(localStorage.getItem("user_name"))

    name_logo.innerText = localStorage.getItem("user_name").charAt(0);
})
name_logo.innerText = localStorage.getItem("user_name").charAt(0);
user_name.innerHTML = localStorage.getItem("user_name");
user_name_settings.innerHTML = localStorage.getItem("user_name");

//Menu Section Toggle
menu_toggle_btn.forEach(toggle => {
    toggle.addEventListener("click" , () => {
        sidebar.classList.toggle("hide_menu");
        if (sidebar.classList[1] === "hide_menu") {
            content_section.style.left = "2rem";
            upper_text.style.left = "4rem";
        } else {
            content_section.style.left = "24rem";
            upper_text.style.left = "24rem";
        }
    })
})

// //Sidebar Modal
settings_toggle.addEventListener("click" , () => {
    sidebar_modal.classList.toggle("show_modal");
    sidebar.style.setProperty("--display_none" , "block");
})
window.addEventListener("click" , (e) => {
    if (e.target === sidebar) {
        sidebar.style.setProperty("--display_none" , "none");
        sidebar_modal.classList.remove("show_modal");
    }
})

//Sidebar Modal Settings
settings_sidebar.addEventListener("click" , e => {
    if(e.target.classList[0] === "theme_container") {
        option_text.innerText = settings_options[0].text;
        under_text.innerText = settings_options[0].under_text;
        option_icon.innerHTML = settings_options[0].icon;
        const darkModeToggle = document.querySelector(".darkmodetoggle");
        darkModeToggle.addEventListener("click" , themeChange)
    } else if (e.target.classList[0] === "language_container"){
        option_text.innerText = settings_options[1].text;
        under_text.innerText = settings_options[1].under_text;
        option_icon.innerHTML = settings_options[1].icon;
        document.querySelector(".knight").addEventListener("click" , () => {
            //
        })
    }
})

//Change Theme
function themeChange(e) {
    const darkMode_i = document.querySelector('.darkmodetoggle i');
    switch(e.target.innerText) {
        case "dark_mode":
            darkMode_i.innerText = "light_mode";
            darkMode()
            break;
        case "light_mode":
            darkMode_i.innerText = "dark_mode";
            lightMode();
    }
}

function lightMode() {
    document.body.classList.remove('light_mode');
    document.body.classList.add('dark_mode');
    localStorage.setItem("theme" , "dark");
}

function darkMode() {
    document.body.classList.remove('dark_mode');
    document.body.classList.add('light_mode');
    localStorage.setItem("theme" , "light");
}

if (localStorage.getItem("theme") === "dark") {
    lightMode();
    localStorage.setItem("theme_name" , "dark_mode")
} else {
    darkMode();
    localStorage.setItem("theme_name" , "light_mode")
}
