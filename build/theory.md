

# Introduction

Recall that modern operating systems use virtualization of resources in order to make the management of processes flexible and efficient.

This experiment introduces the fundamental trick used to virtualize a process&rsquo;s access to the CPU&#x2014;namely, Context Switching. This technique allows the OS to handle arbitrary transfers of control during execution of user programs while still maintaining the overall control of the machine.


# Processes: A closer look

In the last experiment, we considered the 4 state model of a process, which provided us with a general overview of the process states and control transfer. Here, we will focus on the minute details of a process, its execution mechanism, and the transfers of control that take place during its execution&#x2014;both between user process and the kernel, and the other processes.


## Process Context


### Process Control Block

In order to virtualize the execution of a process, the OS needs to have an internal account of the state of a process. This representation of the state of a process is stored in memory as a *Process Control Block*.

A process control block stores 3 kinds of information about a process&#x2014;namely, identification information (Pid), execution state, and control metadata used for scheduling and IPC.

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Type</th>
<th scope="col" class="org-left">Fields</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Identification Information</td>
<td class="org-left">Pid</td>
</tr>


<tr>
<td class="org-left">Execution State Information</td>
<td class="org-left">PC, Registers, Flags, stacks etc.</td>
</tr>


<tr>
<td class="org-left">Scheduling &amp; IPC Information</td>
<td class="org-left">Priority, pointer to the next PCB, IPC messages etc.</td>
</tr>
</tbody>
</table>


### Execution State

1.  CPU State

    1.  General Purpose Registers
    
    2.  Control Registers
    
        <table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">
        
        
        <colgroup>
        <col  class="org-left" />
        
        <col  class="org-left" />
        </colgroup>
        <thead>
        <tr>
        <th scope="col" class="org-left">Register</th>
        <th scope="col" class="org-left">&#xa0;</th>
        </tr>
        </thead>
        
        <tbody>
        <tr>
        <td class="org-left">IDTR</td>
        <td class="org-left">&#xa0;</td>
        </tr>
        
        
        <tr>
        <td class="org-left">&#xa0;</td>
        <td class="org-left">&#xa0;</td>
        </tr>
        
        
        <tr>
        <td class="org-left">&#xa0;</td>
        <td class="org-left">&#xa0;</td>
        </tr>
        
        
        <tr>
        <td class="org-left">&#xa0;</td>
        <td class="org-left">&#xa0;</td>
        </tr>
        </tbody>
        </table>
        
        1.  IDTR

2.  Memory

    1.  Code
    
    2.  Execution Stacks
    
        1.  User Program Stack
        
        2.  Kernel Stack
        
        3.  Other stacks (Interrupt Subroutine Stack etc.)
    
    3.  Descriptor Tables
    
        These data structures provide the dispatch addresses for handlers and are used to implement interfaces. eg. Trap Table is used to implement the interface between software and hardware.


## Interfaces


### User Program-kernel interface: In and out of the Kernel


## Execution Protocols


### Modes of Execution

1.  Privilege Levels


# Execution Protocol


## Managing Control during Program Execution

