import sys
sys.path.insert(0, '.')
try:
    from app.main import app
    print("Compilation OK")
except Exception as e:
    import traceback
    traceback.print_exc()
