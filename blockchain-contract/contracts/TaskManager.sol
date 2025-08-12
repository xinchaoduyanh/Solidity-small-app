// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract TaskManager {
    struct Task {
        uint256 id;
        string title;
        uint256 categoryId;
        bool completed;
        uint256 createdAt;
        uint256 updatedAt;
        address owner;
    }

    Task[] public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 indexed id, string title, uint256 categoryId, address owner, uint256 timestamp);
    event TaskToggled(uint256 indexed id, bool completed, uint256 timestamp);

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _title, uint256 _categoryId) public returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_categoryId > 0, "Category ID must be greater than 0");

        uint256 currentTime = block.timestamp;
        uint256 newTaskId = taskCount + 1;

        Task memory newTask = Task({
            id: newTaskId,
            title: _title,
            categoryId: _categoryId,
            completed: false,
            createdAt: currentTime,
            updatedAt: currentTime,
            owner: msg.sender
        });

        tasks.push(newTask);
        taskCount = newTaskId;

        emit TaskCreated(newTaskId, _title, _categoryId, msg.sender, currentTime);
        return newTaskId;
    }

    function toggleComplete(uint256 _id, bool _completed) public {
        require(_id > 0 && _id <= taskCount, "Invalid task ID");
        
        uint256 taskIndex = _id - 1;
        tasks[taskIndex].completed = _completed;
        tasks[taskIndex].updatedAt = block.timestamp;

        emit TaskToggled(_id, _completed, block.timestamp);
    }

    function completeTask(uint256 _id) public {
        require(_id > 0 && _id <= taskCount, "Invalid task ID");
        
        uint256 taskIndex = _id - 1;
        tasks[taskIndex].completed = true;
        tasks[taskIndex].updatedAt = block.timestamp;

        emit TaskToggled(_id, true, block.timestamp);
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        require(_id > 0 && _id <= taskCount, "Invalid task ID");
        return tasks[_id - 1];
    }

    function getTasksByCategory(uint256 _categoryId) public view returns (Task[] memory) {
        uint256 count = 0;
        
        // Count tasks in category
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].categoryId == _categoryId) {
                count++;
            }
        }

        // Create array with correct size
        Task[] memory categoryTasks = new Task[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].categoryId == _categoryId) {
                categoryTasks[index] = tasks[i];
                index++;
            }
        }

        return categoryTasks;
    }

    function getTaskCount() public view returns (uint256) {
        return taskCount;
    }
}
