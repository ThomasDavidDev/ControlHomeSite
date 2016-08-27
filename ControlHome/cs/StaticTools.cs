using System;
using System.Collections.Generic;

using Bridge;
using Bridge.Html5;

namespace ControlHome
{
	public static class StaticTools
	{
		public static void addArduinoLightBox (HTMLBoxStructure parent, string text, string url, string json = null)
		{
			HTMLBox box = new HTMLBox (text);
			box.Action (delegate {
				Action<Event> actionError = delegate (Event e) {
					Bridge.Console.Error ("Error", e);
					box.Color (error, 1000);
				};
				Action<Event> actionSucces = delegate (Event e) {
					Bridge.Console.Info ("Succes", e);
					box.Color (succes, 1000);
					Vibrate (250);
				};
				XMLHttpRequest request = new XMLHttpRequest ();
				if (json != null) {
					request.Open ("POST", url, true);
					request.SetRequestHeader ("Content-Type", "application/json");
					request.Timeout = 1250;
					request.Send (json);
				} else {
					request.Open ("GET", url, true);
					request.Timeout = 1250;
					request.Send ();
				}
				request.OnTimeout += actionError;
				request.OnAbort += actionError;
				request.OnError += actionError;
				request.OnLoad += (Event e) => {
					if (request.ResponseText.Contains ("Geaccepteerd"))
						actionSucces (e);
					else
						actionError (e);
				};
			});
			parent.addBox (box);
		}

		public static bool Vibrate (double pattern)
		{
			return Script.Call<bool> ("window.navigator.vibrate", pattern);
		}

		public static string loadDoc (string url, Action onReadyStateChange = null)
		{
			XMLHttpRequest doc = new XMLHttpRequest ();
			doc.Open ("GET", url, false);
			if (onReadyStateChange != null) {
				doc.OnReadyStateChange += onReadyStateChange;
			}
			doc.Send ();
			return doc.ResponseText;
		}

		public static string succes = "rgba(63, 191, 63, 0.9)";
		public static string error = "rgba(238, 80, 32, 0.9)";

		public class pulsTimer
		{
			public pulsTimer (int pin, long time, string name)
			{
				this.pin = pin;
				this.time = time;
				this.name = name;
				command = "pulsTimer";
			}

			public string command;
			public string name;
			public int pin;
			public long time;
		}

		public class urlBox
		{
			public string url;
			public string name;
		}
	}
}
