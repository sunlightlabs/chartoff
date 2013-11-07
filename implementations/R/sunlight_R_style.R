library('ggplot2')
library('grid')

#resize window to 650 px width
quartz.options(width = 9.0278, height = 5.7624)

# Untested, but in theory the below line should work in windows (and comment out above line)
#windows.options(width = 9.0278, height = 6)

#################### redefine default ggplot theme ###################
theme_new <- theme_set(theme_bw())
theme_new <- theme_update(
    #background, margins, title
    plot.background = element_rect(fill="#EFECEA", color= NA),
    plot.margin = unit(c(2.8835,.582083,2.0748,.9378), "cm"),
    plot.title = element_text(vjust = 7.9746, hjust = 0, size = 20, family = "ITC Franklin Gothic Std Demi Condensed"),

    #plot area and grid
    panel.border = element_blank(),
    panel.background = element_rect(fill="transparent", size = 0),
    panel.grid.minor = element_blank(),
    panel.grid.major = element_line(size=.4703669, color = "#FFFFFF"),

    #axes, ticks, and axis labels
    axis.line = element_line(size=.4703669, color = "#FFFFFF"),
    axis.ticks = element_blank(),
    axis.ticks.length = unit(.20888, "cm"),
    axis.text.x = element_text(size = 12, family = "ITC Franklin Gothic Std Demi"),
    axis.text.y = element_text(size = 12, family = "ITC Franklin Gothic Std Demi"),
    axis.title.x = element_text(vjust = -2.1804, size = 12, family = "Franklin Gothic Book"),
    axis.title.y = element_text(vjust = -1.2633, angle = -90, size = 12, family = "Franklin Gothic Book"),

    #legend
    legend.background = element_rect(fill = "#E5E2E0", size = .4703669, color = "#C0C0BB"),
    legend.text = element_text(size = 10, family = "Franklin Gothic Book"),
    legend.title = element_blank(),
    legend.key = element_rect(fill="#E5E2E0", colour= "#E5E2E0", size = 0),
    legend.key.height = unit(1, "cm"),
    legend.key.width = unit(.645,"cm"),
    legend.margin = unit(1.5741,"cm")
    )





#############################

#Redefine default discrete colors, up to 9 colors.
#Change 'Set1' to 'Set2' to use D/R/I colors
scale_colour_discrete <- function(...) scale_colour_sunlight(..., palette="Set1")
scale_fill_discrete <- function(...) scale_fill_sunlight(... , palette="Set1")


########### Example plots #################

####Bar
##1 color
#print(ggplot(mtcars, aes(factor(cyl))) + geom_bar() + coord_cartesian(ylim = c(0, 100))+ggtitle("Title"))

##2 colors
#print(qplot(factor(cyl), data=mtcars, geom="bar", fill=factor(vs)) + ggtitle("Title") + geom_bar())

##3 colors
#print(qplot(factor(cyl), data=mtcars, geom="bar", fill=factor(cyl))+ggtitle("Title"))

##5 colors
#print(ggplot(diamonds, aes(clarity, fill=cut)) + geom_bar() +ggtitle("Title") + coord_cartesian(ylim = c(0, 15000)))



####Scatter
##3 colors
#print(ggplot(mtcars, aes(wt, mpg))+geom_point(aes(colour = factor(cyl)))+ggtitle("Title"))

##9 colors
 # dsamp <- diamonds[sample(nrow(diamonds), 1000), ]
 # d <- qplot(carat, price, data=dsamp, colour=clarity, size = 3)
 # print(d+ggtitle("Title"))

####Line
# mry <- do.call(rbind, by(movies, round(movies$rating), function(df) {
#   nums <- tapply(df$length, df$year, length)
#   data.frame(rating=round(df$rating[1]), year = as.numeric(names(nums)), number=as.vector(nums))
# }))
# print(ggplot(mry, aes(x=year, y=number, group=rating))+ geom_line(aes(colour=rating))+ggtitle("Title"))



#################### Functions to Define sunlight colors #####################
   divlist<-c("BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral")
   quallist<-c("Accent","Dark2","Paired","Pastel1","Pastel2","Set1","Set2","Set3")
   seqlist<-c("Blues","BuGn","BuPu","GnBu","Greens","Greys","Oranges","OrRd",
    "PuBu","PuBuGn","PuRd","Purples","RdPu","Reds","YlGn","YlGnBu","YlOrBr","YlOrRd")

   divnum <- rep(11, length(divlist))
   qualnum <- c( 8, 8, 12, 9, 8, 9, 8, 12)
   seqnum <- rep(9, length(seqlist))

   namelist<-c(divlist,quallist,seqlist)
   maxcolors <- c(divnum,qualnum,seqnum)
   catlist<-rep(c("div","qual","seq"),c(length(divlist),length(quallist),length(seqlist)))

   sunlight.pal.info<-data.frame(maxcolors=maxcolors,category=catlist,row.names=namelist)


sunlight.pal<-function(n,name){
   if(!(name %in% namelist)){
   stop(paste(name,"is not a valid palette name for sunlight.pal\n"))
   }
   if(n<3){
   warning("minimal value for n is 3, returning requested palette with 3 different levels\n")
   return(sunlight.pal(3,name))
   }
   if(n>maxcolors[which(name==namelist)]){
   warning(paste("n too large, allowed maximum for palette",name,"is",maxcolors[which(name==namelist)]),
        "\nReturning the palette you asked for with that many colors\n")
   return(sunlight.pal(maxcolors[which(name==namelist)],name))
   }

   switch(name,

    Set1 =  switch(n,

        rgb(c(227),
            c(186),
            c(34),maxColorValue=255),
        rgb(c(227,230),
            c(186,132),
            c(34,42),maxColorValue=255),
        rgb(c(227,230,0),
            c(186,132,93),
            c(34,42,110),maxColorValue=255),
        rgb(c(227,230,0,104),
            c(186,132,93,70),
            c(34,42,110,100),maxColorValue=255),
        rgb(c(227,230,0,104,15),
            c(186,132,93,70,140),
            c(34,42,110,100,121),maxColorValue=255),
        rgb(c(227,230,0,104,15,189),
            c(186,132,93,70,140,45),
            c(34,42,110,100,121,40),maxColorValue=255),
        rgb(c(227,230,0,104,15,189,92),
            c(186,132,93,70,140,45,129),
            c(34,42,110,100,121,40,0),maxColorValue=255),
        rgb(c(227,230,0,104,15,189,92,151),
            c(186,132,93,70,140,45,129,143),
            c(34,42,110,100,121,40,0,128),maxColorValue=255)
        ),
    Set2 =  switch(n,
        rgb(c(154),
            c(62),
            c(37),maxColorValue=255),
        rgb(c(154,21),
            c(62,107),
            c(37,144),maxColorValue=255),
        rgb(c(154,21,112),
            c(62,107,130),
            c(37,144,89),maxColorValue=255)
        )

        )
}

display.sunlight.pal<-function(n,name){
   if(!(name %in% namelist)){
   stop(paste(name,"is not a valid palette name for sunlight.pal\n"))
   }
   if(n<3){
   warning("minimal value for n is 3, displaying requested palette with 3 different levels\n")
   return(display.sunlight.pal(3,name))
   }
   if(n>maxcolors[which(name==namelist)]){
   warning(paste("n too large, allowed maximum for palette",name,"is",maxcolors[which(name==namelist)]),
        "\nDisplaying the palette you asked for with that many colors\n")
   return(display.sunlight.pal(maxcolors[which(name==namelist)],name))
   }


   if(length(which(name==quallist))>0) palattr<-"(qualitative)"
   if(length(which(name==divlist))>0) palattr<-"(divergent)"
   if(length(which(name==seqlist))>0) palattr<-"(sequential)"
    image(1:n,1,as.matrix(1:n),col=sunlight.pal(n,name),
       xlab=paste(name,palattr),ylab="",xaxt="n",yaxt="n",bty="n")

}

display.sunlight.all <-
    function (n=NULL, type="all", select=NULL, exact.n=TRUE)
{
    gaplist <- ""

    totallist <- c(divlist, gaplist, quallist,gaplist, seqlist)
    gapnum <- max(c(divnum,qualnum,seqnum))
    totnum <- c(divnum, gapnum, qualnum, gapnum, seqnum)
    if (!(type %in% c("div","qual","seq","all"))) {
        stop(paste(type, "is not a valid name for a color list\n"))
    }
    colorlist <- switch(type, div=divlist,
                        qual=quallist, seq=seqlist,
                        all=totallist)
    maxnum <- switch(type, div=divnum,
                     qual=qualnum,
                     seq=seqnum,
                     all=totnum)
    if(!is.null(select)){colorlist <- colorlist[select]
                         maxnum <- maxnum[select]
                         if(any(is.na(colorlist)))
                             stop(paste("Illegal value(s) of select: ",
                                        paste(select[is.na(colorlist)],
                                              collapse=" ")))
                     }
    palattr <-  switch(type,  qual="qualitative",  div
                       ="divergent", seq="sequential",
                       all="qualitative+divergent+sequential")
    if(is.null(n))n <- maxnum
    if(length(n)==1)n <- rep(n, length(colorlist))
    if(exact.n){
        keep <- n<=maxnum
        colorlist <- colorlist[keep]
        n <- n[keep]
        maxnum <- maxnum[keep]
    }
    if (any(n < 3) | exact.n & any(n>maxnum)|
        length(n)!=length(colorlist)){
        warning("Illegal vector of color numbers")
        print(paste(n, collapse=" "))
    }
    n[n<3] <- 3
    n[n>maxnum] <- maxnum[n>maxnum]
    nr <- length(colorlist)
    nc <- max(n)
    ylim <- c(0,nr)
    oldpar <- par(mgp=c(2,0.25,0))
    on.exit(par(oldpar))
    plot(1,1,xlim=c(0,nc),ylim=ylim,type="n", axes=FALSE, bty="n",
         xlab="",ylab="")
    for(i in 1:nr)
    {nj <- n[i]
     if(colorlist[i]=="")next
     shadi <- sunlight.pal(nj, colorlist[i])
     rect(xleft=0:(nj-1), ybottom=i-1, xright=1:nj, ytop=i-0.2, col=shadi,
          border="light grey")
 }
    text(rep(-0.1,nr),(1:nr)-0.6, labels=colorlist, xpd=TRUE, adj=1)
}


pal_name <- function(palette, type) {
  if (is.character(palette)) {
    if (!palette %in% RColorBrewer:::namelist) {
      warning("Unknown palette ", palette)
      palette <- "Set1"
    }
    return(palette)
  }

  switch(type,
    div = divlist,
    qual = quallist,
    seq = seqlist,
    stop("Unknown palette type. Should be 'div', 'qual' or 'seq'",
      call. = FALSE)
  )[palette]
}

sunlight_pal <- function(type = "seq", palette = 1) {
  pal <- pal_name(palette, type)

  function(n) {
    if (n < 3)
      suppressWarnings(sunlight.pal(n, pal))[seq_len(n)]
    else
      sunlight.pal(n, pal)[seq_len(n)]
  }
}

scale_colour_sunlight <- function(..., type = "seq", palette = 1) {
  discrete_scale("colour", "sunlight", sunlight_pal(type, palette), ...)
}

#' @export
#' @rdname scale_sunlight
scale_fill_sunlight <- function(..., type = "seq", palette = 1) {
  discrete_scale("fill", "sunlight", sunlight_pal(type, palette), ...)
}