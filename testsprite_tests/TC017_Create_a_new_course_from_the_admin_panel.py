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
        
        # -> Open the login page by clicking the 'Inicia sesión' link so we can authenticate as admin.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/nav/div/div[2]/div[2]/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Enter admin credentials into the email and password fields and submit the login form (Email: admin@ejemplo.com, Password: admin123).
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
        
        # -> Open the course creation form by clicking the 'Crear Nuevo Curso' button.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/div[3]/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the course title, description, price, duration and submit the form.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Course TC Admin Create')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[3]/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('A short description for Course TC Admin Create')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('49.99')
        
        # -> Fill the 'Duración' field and submit the course form by clicking '✅ Crear Curso', then verify success and that the new course appears in the admin courses list.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[3]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('4 semanas')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the creation process to complete, then open the admin 'Cursos' list and verify that 'Course TC Admin Create' appears and that a success confirmation is visible. If confirmed, finish the test.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Open the course creation form by clicking the '➕ Crear Curso' button so we can create the course again and verify the success confirmation and presence in the list.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/div/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the course fields (title, description, price, duration) and submit the form, then verify the success confirmation and that 'Course TC Admin Create' appears in the courses list.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Course TC Admin Create')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[3]/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('A short description for Course TC Admin Create')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('49.99')
        
        # -> Fill the 'Duración' field with '4 semanas' and submit the form by clicking '✅ Crear Curso' to create the course, then verify the success confirmation and that 'Course TC Admin Create' appears in the admin courses list.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[3]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('4 semanas')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the creation process to finish, then open the admin 'Cursos' list and verify that the success confirmation is visible and that 'Course TC Admin Create' appears in the list.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Reload the admin 'Cursos' view so the courses list finishes loading and check for a success confirmation and the new course 'Course TC Admin Create'.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'Course TC Admin Create')]").nth(0).is_visible(), "The admin courses list should include the newly created course after submission"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    