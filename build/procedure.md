### Procedure
We have 12 components in the simulation

* **User Mode**: Where the current running user task's x86 assembly code will be displayed. This mode will only be active when the CPU is in user mode.
* **Hardware**: The hardware in this simulation acts like a bridge between User mode and kernel mode where it enablesthe switch between two modes and provides the resources (k-stack) to both the privilege levels. 
* **Kernel mode**: The kernel mode is active when we run the interrupt handlers and enables us to perform the instructions needed for context switch mechanism.
* **Central Processing Unit**: This is where the execution of code takes place, no matter what the privilege level is. In this simulation, we are to observe how the CPU mode, PC and registers keep changing as we tranverse through the code.
* **K-stack of process A**: where registers of process A will be stored for the execution in the kernel mode.
* **K-stack of process B**: where registers of process B will be stored for the execution in the kernel mode.
* **PCB of process A**: where all the details of the process A will be stored while storing and restoring in the kernel privilege level.
* **PCB of process B**: where all the details of the process B will be stored while storing and restoring in the kernel privilege level.
* **Instruction box**: where the user will be able to select the set of instructions to run while in hardware or kernel Mode.
* **Interrupt handler box**: where you get to choose various interrupt handlers to deal with the interrupts arriving during the simulation.
* **Observations**: where all the observations of the user moves will be displayed.
* **Dialog box**: This gives the instructions to the student to make the correct step to complete the simulation.

We have 5 controls:
* Next & Previous button for the User mode.
* Kernel program 'execute' and 'Context switch' button
* Start and Restart button for the simulation.
* I/O complete trigger to send the I/O complete signal.
* Selecting the correct tasks in instruction box
  
Steps of the simulator:

1. First you click on start button to start the simulator which will prompt the user to first bootstrap the kernel.
2. Once this is done, the simulation starts with a simple addition program loaded into the User mode.
3. You can click on next or previous to traverse through the user program currently running.
4. With the process A being executed, you will receive an timer interrupt. To handle the interrupt, you have to select appropriate instructions from instruction box as instructed by the dialog box. This happens when you are in the hardware.
5. Once you get the correct handler, you will be directed to the kernel mode where you start executed this handler code.
6. Once the code is executed, you will have to select the instructions from the instruction box to make correct steps for the context switch mechanism.
