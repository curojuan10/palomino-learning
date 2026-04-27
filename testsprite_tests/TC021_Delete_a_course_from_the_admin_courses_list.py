import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000
        await page.goto("http://localhost:3000")
        
        # -> Click the 'Inicia sesión' button to open the login form.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/nav/div/div[2]/div[2]/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the email and password fields with admin credentials and submit the login form.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/div/div[3]/div/form/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('admin@ejemplo.com')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/div/div[3]/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('admin123')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/div/div[3]/div/form/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the login to finish, then navigate to the admin courses page (/admin/cursos) to begin creating the test course.
        await page.goto("http://localhost:3000/admin/cursos")
        
        # -> Open the 'Crear Curso' flow by clicking the '➕ Crear Curso' button so the course creation form appears.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/div/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the course form (title, description, price, category, duration) and submit it to create 'Course TC Admin Delete'.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Course TC Admin Delete')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[3]/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('A short description for Course TC Admin Delete')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('19.99')
        
        # -> Select a course category, fill the duration field, then click '✅ Crear Curso' to submit the form.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[3]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('4 semanas')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the course creation to finish and then navigate back to the admin courses list to find and delete 'Course TC Admin Delete'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Open the 'Crear Curso' form by clicking the '➕ Crear Curso' button so the course creation form appears.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/div/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the title, description and price fields, then open the category dropdown (click the category select). After the dropdown opens, wait for options to appear before selecting a category.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Course TC Admin Delete')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[3]/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('A short description for Course TC Admin Delete')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('19.99')
        
        # -> Click the 'Categoría' select to open category options so an option can be selected next.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[2]/select').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the 'Duración' field with '4 semanas' (index 1534) and submit the form by clicking '✅ Crear Curso' (index 1543). Then wait for the UI to process the creation.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[3]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('4 semanas')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the '✅ Crear Curso' submit button (index 1543) to retry creating the course, then wait for the UI to process and observe the result.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert not await frame.locator("xpath=//*[contains(., 'Course TC Admin Delete')]").nth(0).is_visible(), "The deleted course Course TC Admin Delete should no longer appear in the courses list after confirming deletion."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    