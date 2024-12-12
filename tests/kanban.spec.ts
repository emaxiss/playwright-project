import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

test.describe("Kanban Board Tests", () => {
    test.beforeEach(async ({ kanbanPage }) => {
        await kanbanPage.open();
    });

    const testCases = [
        {
            title: 'should display "Implement user authentication" in Web Application To Do column',
            project: 'web',
            columnStatus: ColumnStatus.TO_DO,
            taskTitle: 'Implement user authentication',
            expectedTags: ['Feature', 'High Priority'],
        },
        {
            title: 'should display "Fix navigation bug" in Web Application To Do column',
            project: 'web',
            columnStatus: ColumnStatus.TO_DO,
            taskTitle: 'Fix navigation bug',
            expectedTags: ['Bug'],
        },
        {
            title: 'should display "Design system updates" in Web Application In Progress column',
            project: 'web',
            columnStatus: ColumnStatus.IN_PROGRESS,
            taskTitle: 'Design system updates',
            expectedTags: ['Design'],
        },
        {
            title: 'should display "Push notification system" in Mobile Application To Do column',
            project: 'mobile',
            columnStatus: ColumnStatus.TO_DO,
            taskTitle: 'Push notification system',
            expectedTags: ['Feature'],
        },
        {
            title: 'should display "Offline mode" in Mobile Application In Progress column',
            project: 'mobile',
            columnStatus: ColumnStatus.IN_PROGRESS,
            taskTitle: 'Offline mode',
            expectedTags: ['Feature', 'High Priority'],
        },
        {
            title: 'should display "App icon design" in Mobile Application Done column',
            project: 'mobile',
            columnStatus: ColumnStatus.DONE,
            taskTitle: 'App icon design',
            expectedTags: ['Design'],
        },
    ];

    testCases.forEach(({ title, project, columnStatus, taskTitle, expectedTags }) => {
        test(title, async ({ kanbanPage }) => {
            if (project === 'mobile') {
                await kanbanPage.openMobileAppBoard();
            }

            const column = kanbanPage.getColumnByStatus(columnStatus);
            const task = column.getTaskByTitle(taskTitle);
            await expect(task.element).toBeVisible();

            const taskTags = await task.taskTag.allTextContents();
            expect(taskTags).toHaveLength(expectedTags.length);
            expect(taskTags).toEqual(expectedTags);
        });
    });
});
