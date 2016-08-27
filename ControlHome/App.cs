using Bridge;
using Bridge.Html5;
using Bridge.Linq;

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections;
using System.Collections.Generic;

namespace ControlHome
{
	public class App
	{
		[Ready]
		public static void Main ()
		{
			//No Scroll Bar
			Document.Body.Style.Overflow = Overflow.Hidden;

			//Adding Background
			Bridge.Console.Info ("Loading Background");
			double imgPixels = Math.Max (Window.Screen.Width, Window.Screen.Height);
			string imgSelector =
				imgPixels >= 1920 ? "../img/City_Wallpaper_orig_low.jpg" :
                imgPixels >= 1280 ? "../img/City_Wallpaper_1920X1080.jpg" :
                imgPixels >= 320 ? "../img/City_Wallpaper_1280X720.jpg" :
                "../img/City_Wallpaper_320X180";
			new HTMLBackground (imgSelector, 0.82);

			//Loading button list to display
			Bridge.Console.Info ("Loading JSON file");
			string json = StaticTools.loadDoc ("../data/box_list.json");

			List<StaticTools.pulsTimer> ptList = new List<StaticTools.pulsTimer> ();
			List<StaticTools.urlBox> urlList = new List<StaticTools.urlBox> ();

			//string json = "{\"box_list\":[{...}]}";        
			ptList.AddRange ((JSON.Parse (json) ["box_list"]) as IEnumerable<StaticTools.pulsTimer>);
			urlList.AddRange ((JSON.Parse (json) ["box_urls"]) as IEnumerable<StaticTools.urlBox>);
			string arduino_URL = JSON.Parse (json) ["arduino_URL"] as string;

			Bridge.Console.Info ("Loading boxStructure");
			HTMLBoxStructure boxStructure = new HTMLBoxStructure ();


			//Adding all pulseTimer Events
			Bridge.Console.Info ("Loading pulseTimer boxes");
			foreach (StaticTools.pulsTimer pt in ptList) {
				StaticTools.addArduinoLightBox (boxStructure, pt.name, arduino_URL, JSON.Stringify (pt));
			}

			//Adding an external link
			Bridge.Console.Info ("Loading url boxes");
			foreach (StaticTools.urlBox ub in urlList) {
				boxStructure.addBox (new HTMLBox (ub.name, delegate {
					Window.Open (ub.url, "_blank");
				}));
			}

			Window.SetTimeout (delegate {
				//toggle resize event manually
				CustomEvent ev = new CustomEvent ("resize", new CustomEventInit ());
				ev.InitCustomEvent ("resize", true, false, new object ());
				Window.DispatchEvent (ev);
			}, 10);
		}
	}
}