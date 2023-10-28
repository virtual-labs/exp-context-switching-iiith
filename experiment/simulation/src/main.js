// Variables
let start_simulation = 0;
let pid = 0;
let currently_in = 0;

let h_u_to_k_pointer = 0;
let h_k_to_u_pointer = 0;
let k_pointer = 0;

trap_handler = 0;

// trap handler == 0 -> None
// trap handler == 1 -> Timer interrupt
// trap handler == 2 -> Read System call
// trap handler == 3 -> Exit System call
// trap handler == 4 -> Interrupt driven IO


// Constants

let FB_note = "&#128203";
let pin = "&#128204";
let task = "&#128172";

// User code program A

// --> Process A [An array with the intruction number, code, comment, registers, and register values]

let processA_instructions = [
    { name: "0", value: "pushq %rbp;", comment: "Save the current value of the base pointer to the stack", registers: ["rbp"], register_values: ["0"] },
    { name: "1", value: "movq %rsp, %rbp;", comment: "Set the base pointer to the current value of the stack pointer", registers: ["rbp", "rsp"], register_values: ["0", "0"] },
    { name: "2", value: "movl $5, -12(%rbp);", comment: "Move the value 5 into the memory location at offset -12 from the base pointer", registers: ["rbp", "rsp"], register_values: ["0", "0"] },
    { name: "3", value: "movl $10, -8(%rbp);", comment: "Move the value 10 into the memory location at offset -8 from the base pointer", registers: ["rbp", "rsp", "edx"], register_values: ["0", "0", "0"] },
    { name: "4", value: "movl -12(%rbp), %edx;", comment: "Move the value from the memory location at offset -12 from the base pointer into the %edx register", registers: ["rbp", "rsp", "edx", "eax"], register_values: ["0", "0", "5", "0"] },
    { name: "5", value: "movl -8(%rbp), %eax;", comment: "Move the value from the memory location at offset -8 from the base pointer into the %eax register", registers: ["rbp", "rsp", "edx", "eax"], register_values: ["0", "0", "5", "10"] },
    { name: "6", value: "addl %edx, %eax;", comment: "Add the values in the %edx and %eax registers and store the result in %eax", registers: ["rbp", "rsp", "edx", "eax"], register_values: ["0", "0", "5", "10"] },
    { name: "7", value: "movl %eax, -4(%rbp);", comment: "Move the value in the %eax register into the memory location at offset -4 from the base pointer", registers: ["rbp", "rsp", "edx", "eax"], register_values: ["0", "0", "5", "10"] },
    { name: "8", value: "movl -4(%rbp), %eax;", comment: "Move the value from the memory location at offset -4 from the base pointer into the %eax register", registers: ["rbp", "rsp", "edx", "eax"], register_values: ["0", "0", "5", "10"] },
    { name: "9", value: "popq %rbp;", comment: "Restore the base pointer from the stack", registers: [""], register_values: [""] },
    { name: "10", value: "ret;", comment: "Return from the function", registers: [""], register_values: [""] },
]

// User code program B

// --> Process B [An array with instruction number, code, comment, registers, and register values]

let processB_instructions = [
    { name: "0", value: "pushq %rbp ;", comment: "Save the current value of the base pointer to the stack", registers: ["rbp"], register_values: ["0"] },
    { name: "1", value: "movq %rsp, %rbp ;", comment: "Set the base pointer to the current value of the stack pointer", registers: ["rbp", "rsp"], register_values: ["0", "0"] },
    { name: "2", value: "subq $32, %rsp ;", comment: "Allocate 32 bytes of space on the stack", registers: ["rbp", "rsp"], register_values: ["0", "0"] },
    { name: "3", value: "movq %fs:40, %rax ;", comment: "Move the value at address fs:40 into the %rax register", registers: ["rbp", "rsp", "rax"], register_values: ["0", "0", "0"] },
    { name: "4", value: "movq %rax, -8(%rbp) ;", comment: "Move the value in %rax into the memory location at offset -8 from the base pointer", registers: ["rbp", "rsp", "rax"], register_values: ["0", "0", "0"] },
    { name: "5", value: "xorl %eax, %eax ;", comment: "Set the %eax register to 0 using XOR operation", registers: ["rbp", "rsp", "rax"], register_values: ["0", "0", "0"] },
    { name: "6", value: "movl $15, -16(%rbp) ;", comment: "Move the value 15 into the memory location at offset -16 from the base pointer", registers: ["rbp", "rsp", "rax"], register_values: ["0", "0", "0"] },
    { name: "7", value: "leaq -20(%rbp), %rax ;", comment: "Load the effective address of the memory location at offset -20 from the base pointer into the %rax register", registers: ["rbp", "rsp", "rax"], register_values: ["0", "0", "0"] },
    { name: "8", value: "movq %rax, %rsi ;", comment: "Move the value in %rax into the %rsi register", registers: ["rbp", "rsp", "rax", "rsi"], register_values: ["0", "0", "0", "0"] },
    { name: "9", value: "movl $0, %eax ;", comment: "Move the value 0 into the %eax register", registers: ["rbp", "rsp", "rax", "rsi"], register_values: ["0", "0", "0", "0"] },
    { name: "10", value: "call __isoc99_scanf@PLT ;", comment: "Call the function __isoc99_scanf from the PLT (Procedure Linkage Table)", registers: ["rbp", "rsp", "rax", "rsi"], register_values: ["0", "0", "0", "0"] },
    { name: "11", value: "movl -20(%rbp), %edx ;", comment: "Move the value in the memory location at offset -20 from the base pointer into the %edx register", registers: ["rbp", "rsp", "rax", "rsi", "edx"], register_values: ["0", "0", "0", "0", "0"] },
    { name: "12", value: "movl -16(%rbp), %eax ;", comment: "Move the value in the memory location at offset -16 from the base pointer into the %eax register", registers: ["rbp", "rsp", "rax", "rsi", "edx"], register_values: ["0", "0", "0", "0", "0"] },
    { name: "13", value: "addl %edx, %eax ;", comment: "Add the value in the %edx register to the value in the %eax register", registers: ["rbp", "rsp", "rax", "rsi", "edx"], register_values: ["0", "0", "0", "0", "0"] },
    { name: "14", value: "movl %eax, -12(%rbp) ;", comment: "Move the value in the %eax register into the memory location at offset -12 from the base pointer", registers: ["rbp", "rsp", "rax", "rsi", "edx"], register_values: ["0", "0", "0", "0", "0"] },
    { name: "15", value: "movl -12(%rbp), %eax ;", comment: "Move the value in the memory location at offset -12 from the base pointer into the %eax register", registers: ["rbp", "rsp", "rax", "rsi", "edx"], register_values: ["0", "0", "0", "0", "0"] },
    { name: "16", value: "movq -8(%rbp), %rcx ;", comment: "Move the value in the memory location at offset -8 from the base pointer into the %rcx register", registers: ["rbp", "rsp", "rax", "rsi", "edx", "edi"], register_values: ["0", "0", "0", "0", "0", "0"] },
    { name: "17", value: "xorq %fs:40, %rcx ;", comment: "XOR the value at address fs:40 with the %rcx register", registers: ["rbp", "rsp", "rax", "rsi", "edx", "edi"], register_values: ["0", "0", "0", "0", "0", "0"] },
    { name: "18", value: "ret ;", comment: "Return from the function", registers: ["rbp", "rsp", "rax", "rsi", "edx", "edi"], register_values: ["0", "0", "0", "0", "0", "0"] },
]

// Classes

// Process class A

const ProcessA = {

    name: "Process A",
    pid: 0,
    mode: 'User Mode',
    current_instruction: 0,

    get_name: function () {
        return this.name;
    },

    get_pid: function () {
        return this.pid;
    },

    get_state: function () {
        return this.state;
    },

    get_mode: function () {
        return this.mode;
    },

    get_current_instruction: function () {
        return this.current_instruction;
    },

    set_mode: function (mode) {
        this.mode = mode;
    },

    // Loading the code and comments for process A
    load: function () {
        var code = "";
        var comments = "";

        var table = document.getElementById("userProgram");
        var tbody = document.createElement("tbody");

        var th = document.createElement("th");
        th.innerHTML = "Process A";
        tbody.appendChild(th);

        for (var i = 0; i < processA_instructions.length; i++) {
            var tr = document.createElement("tr");

            id = i;
            code = processA_instructions[i].value;
            comments = processA_instructions[i].comment;

            var td1 = document.createElement("td");
            td1.innerHTML = id;

            var td2 = document.createElement("td");
            td2.innerHTML = `<span style="color: red; font-family: monospace">${code}</span>`;

            var td3 = document.createElement("td");
            td3.innerHTML = `<span style="color: green">${comments}</span>`;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);

        if (trap_handler > 1) {
            this.current_instruction = this.current_instruction + 1;
        }

        this.highlight();

        var elements = document.getElementsByClassName("control-btn");

        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }

        var fb = "<br> 1. You are in process A. <br> 2. CPU is currently executing instruction number: " + this.current_instruction;
        var prompt = "Use the 'Previous' and 'Next' buttons to navigate through the process code."

        assemble_msg(fb, prompt, null);
    },

    highlight: function () {
        var tr = document.getElementById("userProgram").getElementsByTagName("tr")[this.current_instruction];
        tr.style.backgroundColor = "#D6EAF8";
        tr.style.fontWeight = "bold";
    },

    unhighlight: function () {
        var tr = document.getElementById("userProgram").getElementsByTagName("tr")[this.current_instruction];
        tr.style.backgroundColor = "white";
        tr.style.fontWeight = "normal";
    },

    next: function () {
        if (this.current_instruction == 10) {
            h_u_to_k_pointer = 0;
            k_pointer = 0;
            h_k_to_u_pointer = 0;

            var modal = document.getElementById("myModal_exit1");
            modal.style.display = "block";
            var span = document.getElementsByClassName("boot-ex1")[0];
            span.onclick = function () {
                modal.style.display = "none";
            }

            var fb = "<br> 1. You have encountered a exit syscall. <br> 2. The hardware will take over the control now.";
            var prompt = "<br> 1. Skip to the 'Hardware' tab from 'User' tab. <br> 2. The instructions handled by the hardware are present in the 'Subsystem instructions' in the controls section. <br> 3. Pick the instructions in the right order for the hardware to execute.";

            assemble_msg(fb, prompt, null);
            trap_handler = 3;

            hw_user_to_kernel();

            // this.unhighlight();
            // this.current_instruction = this.current_instruction + 1;
            currently_in = 1;
            document.getElementById("cs").innerHTML = "Current Subsytem: Hardware";
            return;
        }
        if (this.current_instruction == 6) {
            var modal = document.getElementById("myModal_timer");
            modal.style.display = "block";
            var span = document.getElementsByClassName("boot-t")[0];
            span.onclick = function () {
                modal.style.display = "none";
            }

            var fb = "<br> 1. You have encountered a timer interrupt. <br> 2. The hardware will take over the control now.";
            var prompt = "<br> 1. Skip to the 'Hardware' tab from 'User' tab. <br> 2. The instructions handled by the hardware are present in the 'Subsystem instructions' in the controls section. <br> 3. Pick the instructions in the right order for the hardware to execute.";

            assemble_msg(fb, prompt, null);
            trap_handler = 1;

            hw_user_to_kernel();

            // this.unhighlight();
            // this.current_instruction = this.current_instruction + 1;
            currently_in = 1;
            document.getElementById("cs").innerHTML = "Current Subsytem: Hardware";
            return;
        }

        this.unhighlight();
        this.current_instruction = this.current_instruction + 1;
        this.highlight();

        var prompt = "CPU is currently executing instruction number: " + this.current_instruction;
        assemble_msg(prompt, null, null);
    },

    previous: function () {
        if (this.current_instruction == 0) {
            return;
        }
        this.unhighlight();
        this.current_instruction = this.current_instruction - 1;
        this.highlight();


        var prompt = "You have jumped to the previous instruction. CPU is currently executing instruction number: " + this.current_instruction;
        assemble_msg(prompt, null, null);
    },

}

// Process class B

const ProcessB = {

    name: "Process B",
    pid: 1,
    mode: 'User Mode',
    current_instruction: 0,

    get_name: function () {
        return this.name;
    },

    get_pid: function () {
        return this.pid;
    },

    get_state: function () {
        return this.state;
    },

    get_mode: function () {
        return this.mode;
    },

    get_current_instruction: function () {
        return this.current_instruction;
    },

    set_mode: function (mode) {
        this.mode = mode;
    },

    // Loading the code and comments for process B
    load: function () {
        var code = "";
        var comments = "";

        var table = document.getElementById("userProgram");
        var tbody = document.createElement("tbody");

        var th = document.createElement("th");
        th.innerHTML = "Process B";
        tbody.appendChild(th);

        for (var i = 0; i < processB_instructions.length; i++) {
            var tr = document.createElement("tr");

            id = i;
            code = processB_instructions[i].value;
            comments = processB_instructions[i].comment;

            var td1 = document.createElement("td");

            td1.innerHTML = id;

            var td2 = document.createElement("td");
            td2.innerHTML = `<span style="color: red; font-family: monospace">${code}</span>`;
            var td3 = document.createElement("td");
            td3.innerHTML = `<span style="color: green">${comments}</span>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);

        if (trap_handler > 1) {
            this.current_instruction = this.current_instruction + 1;
        }

        this.highlight();

        var elements = document.getElementsByClassName("control-btn");

        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }

        var fb = "Process B is loaded into the CPU.";
        var prompt = "Use the 'Previous' and 'Next' buttons to navigate through the process code."

        assemble_msg(fb, prompt, null);

    },

    highlight: function () {
        var tr = document.getElementById("userProgram").getElementsByTagName("tr")[this.current_instruction];
        tr.style.backgroundColor = "#D6EAF8";
        tr.style.fontWeight = "bold";
    },

    unhighlight: function () {
        var tr = document.getElementById("userProgram").getElementsByTagName("tr")[this.current_instruction];
        tr.style.backgroundColor = "white";
        tr.style.fontWeight = "normal";
    },

    next: function () {
        if (this.current_instruction == 18) {
            h_u_to_k_pointer = 0;
            k_pointer = 0;
            h_k_to_u_pointer = 0;

            var modal = document.getElementById("myModal_exit2");
            modal.style.display = "block";
            var span = document.getElementsByClassName("boot-ex2")[0];
            span.onclick = function () {
                modal.style.display = "none";
            }

            var fb = "<br> 1. You have encountered a exit syscall. <br> 2. The hardware will take over the control now.";
            var prompt = "<br> 1. Skip to the 'Hardware' tab from 'User' tab. <br> 2. The instructions handled by the hardware are present in the 'Subsystem instructions' in the controls section. <br> 3. Pick the instructions in the right order for the hardware to execute.";

            assemble_msg(fb, prompt, null);
            trap_handler = 4;

            hw_user_to_kernel();

            // this.unhighlight();
            // this.current_instruction = this.current_instruction + 1;
            currently_in = 1;
            document.getElementById("cs").innerHTML = "Current Subsytem: Hardware";
            return;
        }
        if (this.current_instruction == 10) {
            h_u_to_k_pointer = 0;
            k_pointer = 0;
            h_k_to_u_pointer = 0;

            var modal = document.getElementById("myModal_read");
            modal.style.display = "block";
            var span = document.getElementsByClassName("boot-r")[0];
            span.onclick = function () {
                modal.style.display = "none";
            }

            var fb = "<br> 1. You have encountered a read syscall. <br> 2. The hardware will take over the control now.";
            var prompt = "<br> 1. Skip to the 'Hardware' tab from 'User' tab. <br> 2. The instructions handled by the hardware are present in the 'Subsystem instructions' in the controls section. <br> 3. Pick the instructions in the right order for the hardware to execute.";

            assemble_msg(fb, prompt, null);
            trap_handler = 2;

            hw_user_to_kernel();

            // this.unhighlight();
            // this.current_instruction = this.current_instruction + 1;
            currently_in = 1;
            document.getElementById("cs").innerHTML = "Current Subsytem: Hardware";
            return;
        }
        this.unhighlight();
        this.current_instruction = this.current_instruction + 1;
        this.highlight();

        var prompt = "CPU is currently executing instruction number: " + this.current_instruction;
        assemble_msg(prompt, null, null);
    },

    previous: function () {
        if (this.current_instruction == 0) {
            return;
        }
        this.unhighlight();
        this.current_instruction = this.current_instruction - 1;
        this.highlight();

        var prompt = "You have jumped to the previous instruction. CPU is currently executing instruction number: " + this.current_instruction;
        assemble_msg(prompt, null, null);
    },

}


// Functions

function assemble_msg(FEEDBACK, PROMPT, PIN) {
    var dialogue = document.getElementById("dialog");
    var tb = dialogue.getElementsByTagName("tbody")[0];
    var row = document.createElement("tr");
    var td = document.createElement("td");
    // Assign class to td
    td.className = "msg";

    var text = "";

    if (FEEDBACK != null) {
        text += FB_note + " " + "<strong>Feedback:</strong> <br />" + FEEDBACK + "<br />";
    }

    if (PROMPT != null) {
        text += "<hr>" + task + " " + "<strong>Prompt:</strong> <br/>" + PROMPT + "<br />";
    }

    if (PIN != null) {
        text += "<hr>" + pin + " " + "<strong>Info:</strong>" + PIN;
    }

    td.innerHTML = text;

    var msgElements = document.getElementsByClassName("msg");

    if (msgElements.length > 0) {
        var prev_msg = msgElements[msgElements.length - 1];
        prev_msg.style.backgroundColor = "#85C1E9";
    }
    td.style.backgroundColor = "dodgerblue";
    row.appendChild(td);
    tb.appendChild(row);
    dialogue.appendChild(tb);
}

function next() {
    if (currently_in == 0) {
        pid == 0 ? ProcessA.next() : ProcessB.next();
        loadCPU();
    }
    // if (currently_in == 1) {
    //     document.getElementById("hardware").innerHTML = "";
    //     document.getElementById("insts").innerHTML = "";
    //     currently_in = 0;
    //     if (pid == 0) {
    //         document.getElementById("kStackA").innerHTML = "";
    //         ProcessA.unhighlight();
    //         ProcessA.current_instruction = ProcessA.current_instruction - 1;
    //         ProcessA.highlight();
    //         loadCPU();
    //     }
    //     else {
    //         document.getElementById("kStackB").innerHTML = "";
    //         ProcessB.unhighlight();
    //         ProcessB.current_instruction = ProcessB.current_instruction - 1;
    //         ProcessB.highlight();
    //         loadCPU();
    //     }

    //     k_pointer = 0;
    //     h_u_to_k_pointer = 0;
    //     h_k_to_u_pointer = 0;
    // }
}

function previous() {
    if (currently_in == 0) {
        pid == 0 ? ProcessA.previous() : ProcessB.previous();
        loadCPU();
    }
}

function bootstrap() {
    if (start_simulation == 0) {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        var span = document.getElementsByClassName("boot")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }

        start_simulation = 1;
        document.getElementById("cp").innerHTML += pid == 0 ? "A" : "B";
        document.getElementById("cs").innerHTML += "User";
        document.getElementById("start").innerHTML = "Restart";
        document.getElementById("start").style.backgroundColor = "dodgerblue";
        document.getElementById("start").style.color = "white";

        simulation();
    }
    else {
        // Restart the simulation
        location.reload();
    }
}

function loadCPU() {

    var cpu = document.getElementById("CPU");
    cpu.innerHTML = "";

    var cpu_body = document.createElement("tbody");

    var cpu_row = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.innerHTML = "PC: ";
    var td2 = document.createElement("td");

    if (pid == 0) {
        td2.innerHTML = ProcessA.get_current_instruction() + 1;

        if (ProcessA.get_current_instruction() == 10) {
            td2.innerHTML = ProcessA.get_current_instruction();
        }
    }
    else {
        td2.innerHTML = ProcessB.get_current_instruction() + 1;

        if (ProcessB.get_current_instruction() == 18) {
            td2.innerHTML = ProcessB.get_current_instruction();
        }
    }
    cpu_row.appendChild(td1);
    cpu_row.appendChild(td2);

    var cpu_row2 = document.createElement("tr");
    var td3 = document.createElement("td");
    td3.innerHTML = "Mode: ";
    var td4 = document.createElement("td");
    td4.innerHTML = "User Mode";

    cpu_row2.appendChild(td3);
    cpu_row2.appendChild(td4);

    var cpu_row3 = document.createElement("tr");
    var td5 = document.createElement("td");
    td5.innerHTML = "GPRs: ";
    var td6 = document.createElement("td");

    if (pid == 0) {
        for (var i = 0; i < processA_instructions[ProcessA.current_instruction].registers.length; i++) {
            td6.innerHTML += processA_instructions[ProcessA.current_instruction].registers[i] + ": " + processA_instructions[ProcessA.current_instruction].register_values[i] + "<br />";
        }
    }
    else {
        for (var i = 0; i < processB_instructions[ProcessB.current_instruction].registers.length; i++) {
            td6.innerHTML += processB_instructions[ProcessB.current_instruction].registers[i] + ": " + processB_instructions[ProcessB.current_instruction].register_values[i] + "<br />";
        }
    }

    cpu_row3.appendChild(td5);
    cpu_row3.appendChild(td6);

    cpu_body.appendChild(cpu_row);
    cpu_body.appendChild(cpu_row2);
    cpu_body.appendChild(cpu_row3);

    cpu.appendChild(cpu_body);

}

function simulation() {
    ProcessA.load();
    loadCPU();
}

function hardware_u_to_k_instructions(current_process) {
    return [
        () => `save registers of process ${current_process} to k-stack of process ${current_process}`,
        () => `Move to kernel mode`,
        () => `move to trap handler`,
    ]
}

function hw_user_to_kernel() {

    var cpu = document.getElementById("CPU");
    cpu.innerHTML = " ";

    var hw = document.getElementById("hardware");
    hw.innerHTML = "";

    let process = pid == 0 ? 'A' : 'B';

    var table = document.getElementById("insts");

    var row = table.insertRow(0);
    var cell1 = document.createElement("button");
    cell1.setAttribute("onclick", "shift_to_kernel()");
    cell1.setAttribute("id", "move_to_trap_handler");
    cell1.setAttribute("class", "inst_button");
    cell1.innerHTML = hardware_u_to_k_instructions(process)[2]();
    row.appendChild(cell1);

    row = table.insertRow(-1);
    var cell1 = document.createElement("button");
    cell1.setAttribute("onclick", "move_to_kernel_mode()");
    cell1.setAttribute("id", "move_to_kernel_mode");
    cell1.setAttribute("class", "inst_button");
    cell1.innerHTML = hardware_u_to_k_instructions(process)[1]();
    row.appendChild(cell1);

    row = table.insertRow(-1);
    var cell1 = document.createElement("button");
    cell1.setAttribute("onclick", "save_to_k_stack()");
    cell1.setAttribute("id", "save_to_k_stack");
    cell1.setAttribute("class", "inst_button");
    cell1.innerHTML = hardware_u_to_k_instructions(process)[0]();
    row.appendChild(cell1);

}

function save_to_k_stack() {
    if (h_u_to_k_pointer != 0) {
        var fb = "You have already saved the registers to the k-stack.";
        var prompt = "Select the correct instruction for the hardware to execute";
        var info = "Take a look at the 'Hardware' tab and choose the next instruction appropriately.";

        assemble_msg(fb, prompt, info);
        return;
    }
    h_u_to_k_pointer = 1;
    document.getElementById("save_to_k_stack").style.backgroundColor = "green";
    document.getElementById("save_to_k_stack").style.color = "white";
    document.getElementById("move_to_kernel_mode").disabled = false;

    var hw = document.getElementById("hardware");
    var hw_tb = document.createElement("tbody");
    var hw_row = document.createElement("tr");
    var hw_td = document.createElement("td");

    hw_td.innerHTML = "Save registers of process " + (pid == 0 ? 'A' : 'B') + " to k-stack of process " + (pid == 0 ? 'A' : 'B') + ".";

    hw_row.appendChild(hw_td);
    hw_tb.appendChild(hw_row);
    hw.appendChild(hw_tb);

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "You have selected the correct instruction for the hardware. Now, move to kernel mode.";

    assemble_msg(fb, prompt, null);

    
    if(pid == 0) {
        const table = document.getElementById("kStackA");
        table.innerHTML = "";
        const tbody = document.createElement("tbody");
        for (var i = 0; i < processA_instructions[ProcessA.current_instruction].registers.length; i++) {
            tbody.innerHTML += processA_instructions[ProcessA.current_instruction].registers[i] + ": " + processA_instructions[ProcessA.current_instruction].register_values[i] + "<br />";
        }
        table.appendChild(tbody);
    }
    else {
        const table = document.getElementById("kStackB");
        table.innerHTML = "";
        const tbody = document.createElement("tbody");
        for (var i = 0; i < processB_instructions[ProcessB.current_instruction].registers.length; i++) {
            tbody.innerHTML += processB_instructions[ProcessB.current_instruction].registers[i] + ": " + processB_instructions[ProcessB.current_instruction].register_values[i] + "<br />";
        }
        table.appendChild(tbody);
    }


}

function move_to_kernel_mode() {
    if (h_u_to_k_pointer != 1) {
        var fb = "Oops! You have not selected the correct instruction."
        var prompt = "Please select the correct instruction for the hardware.";

        assemble_msg(fb, prompt, null);
        return;
    }
    h_u_to_k_pointer = 2;
    document.getElementById("move_to_kernel_mode").style.backgroundColor = "green";
    document.getElementById("move_to_kernel_mode").style.color = "white";
    document.getElementById("move_to_trap_handler").disabled = false;

    var hw = document.getElementById("hardware");
    var hw_tb = hw.getElementsByTagName("tbody")[0];
    var hw_row = document.createElement("tr");
    var hw_td = document.createElement("td");

    hw_td.innerHTML = "Move to kernel mode";

    hw_row.appendChild(hw_td);
    hw_tb.appendChild(hw_row);
    hw.appendChild(hw_tb);


    var fb = "Good job! You have selected the correct instruction.";
    var prompt = "It's time for the hardware to find the trap handler and hand it over to the kernel.";

    assemble_msg(fb, prompt, null);

}

function shift_to_kernel() {
    if (h_u_to_k_pointer != 2) {
        var fb = "Oops! This isn't the correct instruction in the sequence of hardware exection."
        var prompt = "Please select the correct instruction for the hardware.";
        var info = "1. You are trying to jump to the trap handler. But, you need to be in kernel mode to do that. <br> 2. You need to save the registers of the process to the k-stack before moving to kernel mode."

        assemble_msg(fb, prompt, info);
        return;
    }
    h_u_to_k_pointer = 3;

    document.getElementById("move_to_trap_handler").style.backgroundColor = "green";
    document.getElementById("move_to_trap_handler").style.color = "white";

    var hw = document.getElementById("hardware");
    var hw_tb = hw.getElementsByTagName("tbody")[0];
    var hw_row = document.createElement("tr");
    var hw_td = document.createElement("td");

    hw_td.innerHTML = "Move to trap handler";

    hw_row.appendChild(hw_td);
    hw_tb.appendChild(hw_row);
    hw.appendChild(hw_tb);

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "Select the correct intrrupt handler from the 'Interrupt Handlers' section.";
    var info = "You can check the interrupt handler loaded in the 'Kernel' tab after that."

    assemble_msg(fb, prompt, info);

    show_handler();
}

function show_handler() {
    if (trap_handler == 1) {

        document.getElementById("Timer").style.backgroundColor = "dodgerblue";
        document.getElementById("Timer").style.color = "white";

        document.getElementById("Timer").onclick = function () {

            document.getElementById("Timer").style.backgroundColor = "#85C1E9";
            document.getElementById("Timer").disabled = true;

            var fb = "Good job! You have selected the correct interrupt handler."
            var prompt = "Click on the 'Complete Execution' button to complete the execution of the trap handler.";

            assemble_msg(fb, prompt, null);

            var table = document.getElementById("Kernel");
            table.innerHTML = "";
            var tb = document.createElement("tbody");
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.innerHTML = "/*\n\
            * Default timer interrupt handler for PIT/HPET\n\
            */\n\
            static irqreturn_t timer_interrupt(int irq, void *dev_id)\n\
            {\n\
            &nbsp;&nbsp;&nbsp;&nbsp;global_clock_event->event_handler(global_clock_event);\n\
            &nbsp;&nbsp;&nbsp;&nbsp;return IRQ_HANDLED;\n\
            }";


            document.getElementById("next").innerHTML = "Complete Execution";
            document.getElementById("next").setAttribute("onclick", "trap_code_execute()");

            row.appendChild(cell1);
            tb.appendChild(row);
            table.appendChild(tb);

            load_kernel();
        }
    }

    if (trap_handler == 2) {
        document.getElementById("Read").style.backgroundColor = "dodgerblue";
        document.getElementById("Read").style.color = "white";

        document.getElementById("Read").onclick = function () {

            document.getElementById("Read").style.backgroundColor = "#85C1E9";
            document.getElementById("Read").disabled = true;

            var fb = "Good job! You have selected the correct interrupt handler."
            var prompt = "Click on the 'Complete Execution' button to complete the execution of the trap handler.";

            assemble_msg(fb, prompt, null);

            var table = document.getElementById("Kernel");
            table.innerHTML = "";
            var tb = document.createElement("tbody");
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.innerHTML = "/*\n\
            * Default timer interrupt handler for PIT/HPET\n\
            */\n\
            static irqreturn_t timer_interrupt(int irq, void *dev_id)\n\
            {\n\
            &nbsp;&nbsp;&nbsp;&nbsp;global_clock_event->event_handler(global_clock_event);\n\
            &nbsp;&nbsp;&nbsp;&nbsp;return IRQ_HANDLED;\n\
            }";


            document.getElementById("next").innerHTML = "Complete Execution";
            document.getElementById("next").setAttribute("onclick", "trap_code_execute()");

            row.appendChild(cell1);
            tb.appendChild(row);
            table.appendChild(tb);

            load_kernel();
        }
    }

    if (trap_handler == 3) {
        document.getElementById("Exit").style.backgroundColor = "dodgerblue";
        document.getElementById("Exit").style.color = "white";



        document.getElementById("Exit").onclick = function () {

            document.getElementById("Exit").style.backgroundColor = "#85C1E9";
            document.getElementById("Exit").disabled = true;

            var fb = "Good job! You have selected the correct interrupt handler."
            var prompt = "Click on the 'Complete Execution' button to complete the execution of the trap handler.";

            assemble_msg(fb, prompt, null);

            var table = document.getElementById("Kernel");
            table.innerHTML = "";
            var tb = document.createElement("tbody");
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.innerHTML = "/*\n\
            * Default timer interrupt handler for PIT/HPET\n\
            */\n\
            static irqreturn_t timer_interrupt(int irq, void *dev_id)\n\
            {\n\
            &nbsp;&nbsp;&nbsp;&nbsp;global_clock_event->event_handler(global_clock_event);\n\
            &nbsp;&nbsp;&nbsp;&nbsp;return IRQ_HANDLED;\n\
            }";

            document.getElementById("next").innerHTML = "Complete Execution";
            document.getElementById("next").onclick = function () {
                document.getElementById("IntIO").style.backgroundColor = "dodgerblue";
                document.getElementById("IntIO").style.color = "white";

                document.getElementById("IntIO").onclick = function () {

                    document.getElementById("IntIO").style.backgroundColor = "#85C1E9";
                    document.getElementById("IntIO").disabled = true;

                    var fb = "Good job! You have selected the correct interrupt handler."
                    var prompt = "Click on the 'Complete Execution' button to complete the execution of the interrupt handler.";

                    assemble_msg(fb, prompt, null);

                    var table = document.getElementById("Kernel");
                    table.innerHTML = "";
                    var tb = document.createElement("tbody");
                    var row = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = "/*\n\
            * Default timer interrupt handler for PIT/HPET\n\
            */\n\
            static irqreturn_t timer_interrupt(int irq, void *dev_id)\n\
            {\n\
            &nbsp;&nbsp;&nbsp;&nbsp;global_clock_event->event_handler(global_clock_event);\n\
            &nbsp;&nbsp;&nbsp;&nbsp;return IRQ_HANDLED;\n\
            }";

                    document.getElementById("next").innerHTML = "Complete Execution";
                    document.getElementById("next").setAttribute("onclick", "trap_code_execute()");

                    row.appendChild(cell1);
                    tb.appendChild(row);
                    table.appendChild(tb);

                    load_kernel();

                }

                var fb = "1. Good job!. You have succesfully executed the exit trap handler. <br>2. Let the IO device generate an Interrupt-driven I/O request to the CPU.";
                var prompt = "Click on the Interrupt driven I/O button in the 'Interrupt handlers' sections to succesfully complete the 'read' syscall of process B.";
                var info = "We are doing this so that we can have the k_stack of process B ready with the input values from the user. <br> This will help us to complete the execution of the 'read' instruction of process B.";

                assemble_msg(fb, prompt, info);
            }
            
            row.appendChild(cell1);
            tb.appendChild(row);
            table.appendChild(tb);



        }

    }

    if (trap_handler == 4) {
        document.getElementById("Exit").style.backgroundColor = "dodgerblue";
        document.getElementById("Exit").style.color = "white";
        document.getElementById("Exit").disabled = false;

        document.getElementById("Exit").onclick = function () {

            document.getElementById("Exit").style.backgroundColor = "#85C1E9";
            document.getElementById("Exit").disabled = true;

            var fb = "Good job! You have selected the correct interrupt handler."
            var prompt = "Click on the 'Complete Execution' button to complete the execution of the trap handler.";

            assemble_msg(fb, prompt, null);

            var table = document.getElementById("Kernel");
            table.innerHTML = "";
            var tb = document.createElement("tbody");
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.innerHTML = "// Default timer interrupt handler for PIT/HPET <br / > static irqreturn_t timer_interrupt(int irq, void *dev_id)<br>{<br>&nbsp;&nbsp;&nbsp;&nbsp;global_clock_event->event_handler(global_clock_event);<br>&nbsp;&nbsp;&nbsp;&nbsp;return IRQ_HANDLED;<br>}";
            

            document.getElementById("next").innerHTML = "Complete Execution";
            document.getElementById("next").setAttribute("onclick", "trap_code_execute()");

            row.appendChild(cell1);
            tb.appendChild(row);
            table.appendChild(tb);

            load_kernel();
        }

    }
}

function load_kernel() {

    cpu = document.getElementById("CPU");
    cpu.innerHTML = "&#11088 The CPU is now executing the trap handler.";

    var inst_table = document.getElementById("insts");
    document.getElementById("cs").innerHTML = "Current Subsytem: Kernel";
    inst_table.innerHTML = "";
}

function context_switch_instructions(process, next_process) {
    return [
        () => `save registers of process ${process} from K-Stack of process ${process} to PCB of process ${process}`,
        () => `load registers of process ${next_process} to K-Stack of process ${next_process} from PCB of process ${next_process}`,
        () => `switch to k-stack of process ${next_process}`,
        () => `return from trap into process ${next_process}`,
    ]
}

function trap_code_execute() {
    var kTable = document.getElementById("Kernel");
    kTable.innerHTML = "";

    var cpu_table = document.getElementById("CPU");
    cpu_table.innerHTML = "";
    cpu_table.innerHTML = "&#11088 CPU now executes the context switch instructions.";

    var fb = "1. Good job! You have completed the execution of the trap handler. <br> 2. The CPU now executes the context switch instructions."
    var prompt = "Select the instructions in the right sequence from the 'Subsystem instructions' section to complete the context switch.";

    document.getElementById("next").style.display = "none";

    assemble_msg(fb, prompt, null);

    let process = pid == 0 ? 'A' : 'B';
    let next_process = pid == 0 ? 'B' : 'A';

    var table = document.getElementById("insts");
    table.innerHTML = "";

    if (trap_handler != 4) {
        var row = table.insertRow(0);
        var cell1 = document.createElement("button");
        cell1.setAttribute("onclick", "switch_to_k_stack()");
        cell1.setAttribute("id", "switch_to_k_stack");
        cell1.setAttribute("class", "inst_button");
        cell1.innerHTML = context_switch_instructions(process, next_process)[2]();
        row.appendChild(cell1);
    }

    row = table.insertRow(-1);
    var cell1 = document.createElement("button");
    cell1.setAttribute("onclick", "save_to_PCB()");
    cell1.setAttribute("id", "save_to_PCB");
    cell1.setAttribute("class", "inst_button");
    cell1.innerHTML = context_switch_instructions(process, next_process)[0]();
    row.appendChild(cell1);

    if (trap_handler != 4) {

        var row = table.insertRow(-1);
        var cell1 = document.createElement("button");
        cell1.setAttribute("onclick", "restore_from_PCB()");
        cell1.setAttribute("id", "restore_from_PCB");
        cell1.setAttribute("class", "inst_button");
        cell1.innerHTML = context_switch_instructions(process, next_process)[1]();
        row.appendChild(cell1);

    }
    
    
    row = table.insertRow(-1);
    var cell1 = document.createElement("button");
    cell1.setAttribute("onclick", "return_from_trap()");
    cell1.setAttribute("id", "return_from_trap");
    cell1.setAttribute("class", "inst_button");
    cell1.innerHTML = context_switch_instructions(process, next_process)[3]();
    if (trap_handler == 4) {
        cell1.innerHTML = "Return from trap";
    }
    row.appendChild(cell1);
}

function save_to_PCB() {
    if (k_pointer != 0) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Kernel' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    k_pointer++;

    if (trap_handler == 4) {
        k_pointer = 3;
    }

    document.getElementById("save_to_PCB").style.backgroundColor = "green";
    document.getElementById("save_to_PCB").style.color = "white";

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "It's time to restore the registers of the process from it's PCB.";

    assemble_msg(fb, prompt, null);

    var kTable = document.getElementById("Kernel");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    let process = pid == 0 ? 'A' : 'B';
    let next_process = pid == 0 ? 'B' : 'A';
    cell1.innerHTML = context_switch_instructions(process, next_process)[0]();

    row.appendChild(cell1);
    tb.appendChild(row);
    kTable.appendChild(tb);

    if (pid == 0) {

        const pcbTable = document.getElementById("pcbA");
        pcbTable.innerHTML = "";
        const tbody = document.createElement("tbody");
    
        const tr1 = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.innerHTML = "PC: ";
        td2.innerHTML = ProcessA.current_instruction;
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tbody.appendChild(tr1);
    
        const tr3 = document.createElement("tr");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        td5.innerHTML = "Registers: ";
        for (var i = 0; i < processA_instructions[ProcessA.current_instruction].registers.length; i++) {
            td6.innerHTML += processA_instructions[ProcessA.current_instruction].registers[i] + ": " + processA_instructions[ProcessA.current_instruction].register_values[i] + "<br />";
        }
        tr3.appendChild(td5);
        tr3.appendChild(td6);
        tbody.appendChild(tr3);
    
        pcbTable.appendChild(tbody);
    }

    else {

        const pcbTable = document.getElementById("pcbB");
        pcbTable.innerHTML = "";
        const tbody = document.createElement("tbody");
    
        const tr1 = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.innerHTML = "PC: ";
        td2.innerHTML = ProcessA.current_instruction;
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tbody.appendChild(tr1);
    
        const tr3 = document.createElement("tr");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        td5.innerHTML = "Registers: ";
        for (var i = 0; i < processB_instructions[ProcessB.current_instruction].registers.length; i++) {
            td6.innerHTML += processB_instructions[ProcessB.current_instruction].registers[i] + ": " + processB_instructions[ProcessB.current_instruction].register_values[i] + "<br />";
        }
        tr3.appendChild(td5);
        tr3.appendChild(td6);
        tbody.appendChild(tr3);
    
        pcbTable.appendChild(tbody);
    }

}

function restore_from_PCB() {
    if (k_pointer != 1) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Kernel' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    k_pointer++;

    document.getElementById("restore_from_PCB").style.backgroundColor = "green";
    document.getElementById("restore_from_PCB").style.color = "white";

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "It's time to switch to the kernel stack of the next process.";

    assemble_msg(fb, prompt, null);

    var kTable = document.getElementById("Kernel");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    let process = pid == 0 ? 'A' : 'B';
    let next_process = pid == 0 ? 'B' : 'A';
    cell1.innerHTML = context_switch_instructions(process, next_process)[1]();

    row.appendChild(cell1);
    tb.appendChild(row);
    kTable.appendChild(tb);
}

function switch_to_k_stack() {
    if (k_pointer != 2) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Kernel' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    k_pointer++;

    document.getElementById("switch_to_k_stack").style.backgroundColor = "green";
    document.getElementById("switch_to_k_stack").style.color = "white";

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "It's time to return from the trap into the next process.";

    assemble_msg(fb, prompt, null);

    var kTable = document.getElementById("Kernel");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    let process = pid == 0 ? 'A' : 'B';
    let next_process = pid == 0 ? 'B' : 'A';
    cell1.innerHTML = context_switch_instructions(process, next_process)[2]();

    row.appendChild(cell1);
    tb.appendChild(row);
    kTable.appendChild(tb);
}

function Hardware_kernelToUserMode(process) {
    return [
        () => `restore registers of process ${process} from k-stack of process ${process}`,
        () => `Move to user mode`,
        () => `jump to process ${process}'s PC`,
    ]
}

function return_from_trap() {
    if (k_pointer != 3) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Kernel' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    k_pointer++;


    document.getElementById("return_from_trap").style.backgroundColor = "green";
    document.getElementById("return_from_trap").style.color = "white";

    if (trap_handler == 4) {
        var fb = "Hurray! You have successfully completed the execution of the programs A and B."
        var prompt = "Click on the 'End' button to end the simulation.";

        assemble_msg(fb, prompt, null);

        document.getElementById("next").display = "block";
        document.getElementById("next").innerHTML = "End";
        document.getElementById("next").onclick = function () {
            location.reload();
        }
        return;
    }

    var fb = "Good job! You have successfully completed the context switch!"
    var prompt = "1. Now skip to 'Hardware' tab to change the CPU mode and to start in the new process. <br> 2. The functions performed by the hardware to do this are already loaded in the 'Subsystem instructions'. <br> 3. Please select the instructions in right order.";

    document.getElementById("cs").innerHTML = "Current Subsytem: Hardware";
    document.getElementById("cp").innerHTML = "Current Process: " + (pid == 0 ? 'A' : 'B');

    assemble_msg(fb, prompt, null);

    var hw = document.getElementById("hardware");
    hw.innerHTML = "";

    var kTable = document.getElementById("Kernel");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    let process = pid == 0 ? 'A' : 'B';
    let next_process = pid == 0 ? 'B' : 'A';
    cell1.innerHTML = context_switch_instructions(process, next_process)[3]();

    if (pid == 0) {
        pid = 1;
    } else {
        pid = 0;
    }

    row.appendChild(cell1);
    tb.appendChild(row);
    kTable.appendChild(tb);

    load_hw_k_to_u_instructions();

}

function load_hw_k_to_u_instructions() {
    var hw = document.getElementById("insts");
    hw.innerHTML = "";

    var tb = document.createElement("tbody");

    var row = tb.insertRow(0);
    var cell1 = document.createElement("button");
    cell1.setAttribute("class", "inst_button");
    cell1.setAttribute("onclick", "change_cpu_mode()");
    cell1.setAttribute("id", "change_cpu_mode");
    cell1.innerHTML = Hardware_kernelToUserMode(pid == 0 ? 'A' : 'B')[1]();
    row.appendChild(cell1);
    tb.appendChild(row);

    var row = tb.insertRow(-1);
    var cell1 = document.createElement("button");
    cell1.setAttribute("class", "inst_button");
    cell1.setAttribute("onclick", "restore_from_k_stack()");
    cell1.setAttribute("id", "restore_from_k_stack");
    cell1.innerHTML = Hardware_kernelToUserMode(pid == 0 ? 'A' : 'B')[0]();
    row.appendChild(cell1);
    tb.appendChild(row);

    var row = tb.insertRow(-1);
    var cell1 = document.createElement("button");
    cell1.setAttribute("class", "inst_button");
    cell1.setAttribute("onclick", "jump_to_user()");
    cell1.setAttribute("id", "jump_to_user");
    cell1.innerHTML = Hardware_kernelToUserMode(pid == 0 ? 'A' : 'B')[2]();
    row.appendChild(cell1);
    tb.appendChild(row);

    hw.appendChild(tb);

    document.getElementById("CPU").innerHTML = "";

}

function restore_from_k_stack() {
    if (h_k_to_u_pointer != 0) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Hardware' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    h_k_to_u_pointer++;

    document.getElementById("restore_from_k_stack").style.backgroundColor = "green";
    document.getElementById("restore_from_k_stack").style.color = "white";

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "It's time to change the CPU mode to user mode.";

    assemble_msg(fb, prompt, null);

    var hw = document.getElementById("hardware");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    cell1.innerHTML = Hardware_kernelToUserMode(pid == 0 ? 'A' : 'B')[0]();

    row.appendChild(cell1);
    tb.appendChild(row);
    hw.appendChild(tb);
}

function change_cpu_mode() {
    if (h_k_to_u_pointer != 1) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Hardware' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    h_k_to_u_pointer++;

    document.getElementById("change_cpu_mode").style.backgroundColor = "green";
    document.getElementById("change_cpu_mode").style.color = "white";

    var fb = "Good job! You have selected the correct instruction."
    var prompt = "It's time to jump to the user process.";

    assemble_msg(fb, prompt, null);

    var hw = document.getElementById("hardware");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    cell1.innerHTML = Hardware_kernelToUserMode(pid == 0 ? 'A' : 'B')[1]();

    row.appendChild(cell1);
    tb.appendChild(row);
    hw.appendChild(tb);
}

function jump_to_user() {
    if (h_k_to_u_pointer != 2) {
        var fb = "Oops! You have selected the wrong instruction."
        var prompt = "Select the next correct instruction to do the context switch.";
        var info = "Look at the instructions already executed by the CPU in the 'Hardware' tab.";

        assemble_msg(fb, prompt, info);
        return;
    }

    h_k_to_u_pointer++;

    document.getElementById("jump_to_user").style.backgroundColor = "green";
    document.getElementById("jump_to_user").style.color = "white";

    var fb = "Good job! All the hardware functions are done."
    var prompt = "Skip to the 'User' tab and start traversing through the new process loaded.";

    assemble_msg(fb, prompt, null);

    var hw = document.getElementById("hardware");
    var tb = document.createElement("tbody");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");

    cell1.innerHTML = Hardware_kernelToUserMode(pid == 0 ? 'A' : 'B')[2]();
    document.getElementById("cs").innerHTML = "Current Subsytem: User";

    row.appendChild(cell1);
    tb.appendChild(row);
    hw.appendChild(tb);

    loadCPU();

    currently_in = 0;

    document.getElementById("next").innerHTML = "Next";
    document.getElementById("next").style.display = "block";
    document.getElementById("next").setAttribute("onclick", "next()");

    document.getElementById("userProgram").innerHTML = "";

    if (pid == 0) {
        ProcessA.load();
    } else {
        ProcessB.load();
    }

    document.getElementById("insts").innerHTML = "";
}

// 1. CPU is executing the context switch code
// 2. mode: Kernel
// 3. Registers: [Not necessary to know]
