"""
Command-line interface for Creations Builder.
"""

import sys
import webbrowser
from threading import Timer
import click
from .app import create_app


def open_browser(url):
    """Open browser after a short delay to ensure server is running."""
    webbrowser.open(url)


@click.command()
@click.option('--host', default='127.0.0.1', help='Host to bind to')
@click.option('--port', default=5000, help='Port to bind to')
@click.option('--debug', is_flag=True, help='Enable debug mode')
@click.option('--no-browser', is_flag=True, help='Don\'t open browser automatically')
def main(host, port, debug, no_browser):
    """
    Launch the Creations Builder web interface.
    
    This starts a local web server and opens the visual programming interface
    in your default browser.
    """
    app = create_app()
    
    url = f"http://{host}:{port}"
    
    if not no_browser:
        click.echo(f"Opening browser at {url}")
        Timer(1.5, open_browser, args=[url]).start()
    else:
        click.echo(f"Server running at {url}")
    
    click.echo("Press Ctrl+C to stop the server")
    
    try:
        app.run(host=host, port=port, debug=debug)
    except KeyboardInterrupt:
        click.echo("\nShutting down...")
        sys.exit(0)


if __name__ == '__main__':
    main()
