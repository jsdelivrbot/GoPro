<%@ WebHandler Language="C#" Class="RicoHandler" %>

using System;
using System.Web;
using System.Net;
using System.IO;
public class RicoHandler : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";

        string url = context.Request.QueryString["url"];
        if (url != null)
        {

            HttpWebRequest webrequest = (HttpWebRequest)System.Net.WebRequest.Create(url);

            if (context.Request.Headers["Authorization"] != null)
            {
                webrequest.Headers.Add("Authorization", context.Request.Headers["Authorization"]);
            }

            if (context.Request.HttpMethod == "POST")
            {
                webrequest.ContentType = context.Request.ContentType;
                webrequest.Method = context.Request.HttpMethod;

                Stream input = context.Request.InputStream;
                byte[] data = new byte[context.Request.ContentLength];
                input.Read(data, 0, context.Request.ContentLength);

                webrequest.ContentLength = data.Length;
                Stream myStream = webrequest.GetRequestStream();
                myStream.Write(data, 0, data.Length);
                myStream.Close();
            }

            HttpWebResponse webresponse;

            webresponse = (HttpWebResponse)webrequest.GetResponse();

            StreamReader loResponseStream = new StreamReader(webresponse.GetResponseStream());

            string Response = loResponseStream.ReadToEnd();
            context.Response.Write(Response);
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
