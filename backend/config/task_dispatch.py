import logging
import threading

from django import db

logger = logging.getLogger(__name__)


def _run_locally(task, args, kwargs):
    try:
        task.apply(args=args, kwargs=kwargs, throw=True)
    except Exception:
        logger.exception("task.local_run.failed task=%s args=%s", task.name, args)
    finally:
        db.connections.close_all()


def run_in_background(task, *args, **kwargs):
    # Tasks call Gemini and can take minutes, so never run them on a request thread.
    threading.Thread(
        target=_run_locally,
        args=(task, args, kwargs),
        name=f"task-{task.name}",
        daemon=True,
    ).start()


def dispatch(task, *args, **kwargs):
    """Queue a Celery task, or run it in a background thread when no broker is reachable."""
    try:
        return task.delay(*args, **kwargs)
    except Exception:
        logger.exception("task.dispatch.failed task=%s args=%s; running in a background thread", task.name, args)
        run_in_background(task, *args, **kwargs)
        return None
