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
        
        # -> Fill the email and password fields with the provided credentials, then submit the login form.
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
        
        # -> Create a course in the admin panel so we can produce a purchase to approve and then verify the student dashboard reflects active access.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/div[3]/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the new course form fields (Title, Description, Price) and choose a Category. Per dependent-field rules, stop after selecting the Category so the UI can reflect any dependent changes before continuing.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Curso de Prueba - Acceso Aprobado')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[3]/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('Curso creado para verificar que compras aprobadas otorgan acceso activo al estudiante.')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('10.00')
        
        # -> Fill the Duración field and submit the form to create the new course.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[3]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('4 semanas')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the course creation request to finish and then open the Admin 'Cursos' list to confirm the newly created course exists.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the Cursos list to finish loading and verify the newly created course appears in the admin Cursos list; if the course is present, proceed to create or locate a pending payment to approve.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Open the 'Crear Curso' form to create a new course (click the '➕ Crear Curso' button), then observe the course creation form fields.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/div/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the course form fields (Título, Descripción, Precio, Duración), submit the form to create the course, then wait for the server response so we can confirm the course appears in the Cursos list.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Curso de Prueba - Acceso Aprobado')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[3]/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('Curso creado para verificar que compras aprobadas otorgan acceso activo al estudiante.')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div/input').nth(0)
        await asyncio.sleep(3); await elem.fill('10.00')
        
        # -> Click the '✅ Crear Curso' submit button (index 1344) to create the course, then wait for the server response and verify the course appears in the Cursos list.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Fill the Duración field with '4 semanas' and submit the '✅ Crear Curso' button to attempt creating the course again, then wait for the server response and check the Cursos list.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[4]/div[3]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('4 semanas')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/main/div/div/form/div[5]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait for the course creation request to finish, then open the admin Cursos list and verify the newly created course appears.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Open the admin Cursos list to inspect the existing courses and the error context (navigate to the Cursos view).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/main/div/aside/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'Acceso activo')]").nth(0).is_visible(), "The dashboard should show at least one enrolled course with active access after approving a purchase."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    